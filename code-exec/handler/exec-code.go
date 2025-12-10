package handler

import (
	// "archive/tar"
	// "bytes"
	"code-exec/models"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"

	// "time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/gofiber/fiber/v2"
)

type JestResult struct {
	NumTotalTests  int `json:"numTotalTests"`
	NumPassedTests int `json:"numPassedTests"`
	NumFailedTests int `json:"numFailedTests"`
}

func ExecCode(code string, problemName string, isFrontendCode bool, c *fiber.Ctx) (models.Result, error) {
	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return models.Result{}, errors.New("Failed to connect to Docker")
	}
	defer cli.Close()

	// 🧩 Create a unique temporary sandbox directory for each run
	sandboxDir, err := os.MkdirTemp("", "coderacer-sandbox-*")
	if err != nil {
		return models.Result{}, errors.New("Failed to create sandbox")
	}
	defer os.RemoveAll(sandboxDir) // cleanup after run

	// 🧩 Copy your template project files into this temp sandbox
	// templateDir := "/home/avadhoot/Projects/CodeRacer/code-exec/js-template"
	// templateDir := os.Getenv("BE_TEMPLATE_DIR_PATH")
	var templateDir string
	if isFrontendCode {
		templateDir = os.Getenv("FE_TEMPLATE_DIR_PATH")
	} else {
		templateDir = os.Getenv("BE_TEMPLATE_DIR_PATH")
	}

	err = copyDir(templateDir, sandboxDir)
	if err != nil {
		return models.Result{}, errors.New("Failed to copy template")
	}

	// 🧩 Write user code to the sandbox
	var userCodePath string
	if isFrontendCode {
		userCodePath = filepath.Join(sandboxDir, fmt.Sprintf("src/problems/%s", problemName), "submission.jsx")
	} else {
		userCodePath = filepath.Join(sandboxDir, fmt.Sprintf("problems/%s", problemName), "submission.js")
	}
	err = os.WriteFile(userCodePath, []byte(code), 0644)
	if err != nil {
		return models.Result{}, errors.New("Failed to write code to sandbox")
	}

	backendCommand := []string{"bash", "-c", "pnpm install --ignore-scripts --frozen-lockfile && pnpm exec jest --json --outputFile=result.json"}

	// For frontend, run vitest on the specific problem directory
	frontendTestPath := fmt.Sprintf("src/problems/%s", problemName)
	frontendCommand := []string{"bash", "-c", fmt.Sprintf("pnpm install --ignore-scripts --frozen-lockfile && pnpm vitest run %s --reporter=json --outputFile=result.json", frontendTestPath)}

	var Command []string
	if isFrontendCode {
		Command = frontendCommand
	} else {
		Command = backendCommand
	}

	//  Create container using sandbox as volume
	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "node-pnpm-runner:latest",
		User:  "root",
		// Cmd:        []string{"bash", "-c", "pnpm install --ignore-scripts --frozen-lockfile && pnpm exec jest --json --outputFile=result.json"},
		Cmd:        Command,
		WorkingDir: "/sandbox",
		Tty:        false,
	}, &container.HostConfig{
		Binds: []string{
			fmt.Sprintf("%s:/sandbox", sandboxDir),
		},
	}, nil, nil, "")

	if err != nil {
		return models.Result{}, errors.New("Failed to create container")
	}
	defer func() {
		cli.ContainerRemove(ctx, resp.ID, container.RemoveOptions{Force: true})
	}()

	// Start container
	if err := cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return models.Result{}, errors.New("Failed to start container")
	}

	// Wait for container to finish running Jest
	statusCh, errCh := cli.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
	select {
	case err := <-errCh:
		if err != nil {
			return models.Result{}, errors.New("Error during container execution")
		}
	case <-statusCh:
	}

	//  Try to read Jest results
	resultPath := filepath.Join(sandboxDir, "result.json")
	data, err := os.ReadFile(resultPath)
	if err != nil {
		logReader, logErr := cli.ContainerLogs(ctx, resp.ID, container.LogsOptions{ShowStdout: true, ShowStderr: true})
		if logErr == nil {
			logs, _ := io.ReadAll(logReader)
			log.Println(string(logs))
			return models.Result{}, errors.New("Test execution failed")
		}

		return models.Result{}, errors.New("Test execution failed")
	}

	var result JestResult
	json.Unmarshal(data, &result)

	return models.Result{
		NumTotalTests:  result.NumTotalTests,
		NumPassedTests: result.NumPassedTests,
		NumFailedTests: result.NumFailedTests,
	}, nil
}

// 🛠️ Helper: copyDir recursively copies a directory (used to clone template into sandbox)
func copyDir(src string, dest string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}

		// Skip node_modules directory
		if info.IsDir() && info.Name() == "node_modules" {
			return filepath.SkipDir
		}

		targetPath := filepath.Join(dest, relPath)

		if info.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}

		// Skip symlinks
		if info.Mode()&os.ModeSymlink != 0 {
			return nil
		}

		// copy file
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		return os.WriteFile(targetPath, data, info.Mode())
	})
}
