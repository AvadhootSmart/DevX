package handler
import (
	// "archive/tar"
	// "bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	// "time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/gofiber/fiber/v2"
)

type JestResult struct {
	NumTotalTests int `json:"numTotalTests"`
	NumPassedTests int `json:"numPassedTests"`
	NumFailedTests int `json:"numFailedTests"`
}


func ExecCode(code string, problemName string,isFrontendCode bool,  c *fiber.Ctx) {
	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to connect to Docker"})
		return
	}
	defer cli.Close()

	// 🧩 Create a unique temporary sandbox directory for each run
	sandboxDir, err := os.MkdirTemp("", "coderacer-sandbox-*")
	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create sandbox"})
		return
	}
	defer os.RemoveAll(sandboxDir) // cleanup after run

	// 🧩 Copy your template project files into this temp sandbox
	// templateDir := "/home/avadhoot/Projects/CodeRacer/code-exec/js-template"
	templateDir := os.Getenv("TEMPLATE_DIR_PATH")
	err = copyDir(templateDir, sandboxDir)
	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to copy template"})
		return
	}

	// 🧩 Write user code to the sandbox
	// userCodePath := filepath.Join(sandboxDir, "problems/hello-api", "submission.js") //filepath based on problem name???
	userCodePath := filepath.Join(sandboxDir, fmt.Sprintf("problems/%s", problemName), "submission.js")
	err = os.WriteFile(userCodePath, []byte(code), 0644)
	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to write code to sandbox"})
		return
	}

	backendCommand := []string{"bash", "-c", "pnpm install --ignore-scripts --frozen-lockfile && pnpm exec jest --json --outputFile=result.json"}

	frontendCommand := []string{"bash", "-c", "pnpm install --ignore-scripts --frozen-lockfile && pnpm exec jest --json --outputFile=result.json"}

	var Command []string
	if isFrontendCode {
		Command = frontendCommand 
	}else {
		Command = backendCommand
	}

	//  Create container using sandbox as volume
	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image:      "node-pnpm-runner:latest",
		User:       "root",
		// Cmd:        []string{"bash", "-c", "pnpm install --ignore-scripts --frozen-lockfile && pnpm exec jest --json --outputFile=result.json"},
		Cmd: Command,
		WorkingDir: "/sandbox",
		Tty:        false,
	}, &container.HostConfig{
			Binds: []string{
				fmt.Sprintf("%s:/sandbox", sandboxDir),
			},
		}, nil, nil, "")

	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create container"})
		return
	}
	defer func() {
		cli.ContainerRemove(ctx, resp.ID, container.RemoveOptions{Force: true})
	}()

	// Start container
	if err := cli.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to start container"})
		return
	}

	// Wait for container to finish running Jest
	statusCh, errCh := cli.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
	select {
	case err := <-errCh:
		if err != nil {
			c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error during container execution"})
			return
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
			c.Status(fiber.StatusOK).JSON(fiber.Map{
				"error": "Test execution failed",
				"logs":  string(logs),
			})
			return
		}

		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to read Jest result"})
		return
	}

	var result JestResult
	json.Unmarshal(data, &result)

	// Respond with test results
	c.JSON(fiber.Map{
		"total":  result.NumTotalTests,
		"passed": result.NumPassedTests,
		"failed": result.NumFailedTests,
	})
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
		targetPath := filepath.Join(dest, relPath)

		if info.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}

		// copy file
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		return os.WriteFile(targetPath, data, info.Mode())
	})
}

