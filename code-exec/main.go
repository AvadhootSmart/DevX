package main

import (
	"code-exec/db"
	"code-exec/handler"
	"code-exec/middlewares"
	"code-exec/models"
	"code-exec/static-data/problems"
	"time"

	// "os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	// "github.com/docker/docker/api/types/strslice"
)

func main() {
	db := db.ConnectDB()
	db.AutoMigrate(&models.User{}, &models.Problem{}, &models.Submission{})

	app := fiber.New(fiber.Config{
		ReadTimeout:  30 * time.Second, // Increase read timeout to 30 seconds
		WriteTimeout: 30 * time.Second, // Increase write timeout to 30 seconds
		IdleTimeout:  60 * time.Second, // Keep connections alive for 60 seconds
	})
	app.Use(logger.New(logger.Config{
		Next: func(c *fiber.Ctx) bool {
			return c.Method() == "OPTIONS"
		},
	}))

	// var CLIENT_URL string = os.Getenv("PROD_URL")
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,DELETE,HEAD",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Server Running 🚀")
	})

	dbHandler := handler.NewDbHandler(db)
	//Problem routes
	app.Post("/create/problem", dbHandler.CreateProblem)
	app.Get("/problems", dbHandler.GetProblems)
	app.Get("/problem/:path", dbHandler.GetProblemByPath)

	//Auth routes
	app.Post("/register", dbHandler.RegisterUser)
	app.Post("/login", dbHandler.LoginUser)

	// app.Get("/user/:id", dbHandler.GetUserById)
	app.Get("/user/:email", dbHandler.GetUserByEmail)

	app.Get("/v1/me", middlewares.IsAuthenticated, handler.MeHandler)
	app.Get("/me", middlewares.IsAuthenticated, dbHandler.GetUserById)

	app.Post("/submit", middlewares.IsAuthenticated, dbHandler.SubmitProblem)
	app.Get("/submissions", middlewares.IsAuthenticated, dbHandler.GetUserSubmissions)

	app.Post("/v1/submit", func(c *fiber.Ctx) error {
		type Request struct {
			Code        string `json:"code"`
			ProblemPath string `json:"problem_path"`
			IsFrontend  bool   `json:"is_frontend"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return err
		}

		result, err := handler.ExecCode(req.Code, req.ProblemPath, req.IsFrontend, c)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(result)
	})

	// app.Get("/v1/problem/:id", func(c *fiber.Ctx) error {
	// 	id := c.Params("id")

	// 	problemsMap := map[string]problems.IProblem{
	// 		"hello-api": problems.PROBLEM_HELLO,
	// 		"pagination": problems.PROBLEM_PAGINATION,
	// 	}

	// 	problemData := problemsMap[id]

	// 	return c.JSON(fiber.Map{
	// 		"problem": problemData,
	// 	})
	// })

	app.Get("/solution/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		solutionsMap := map[string]string{
			"hello-api":  problems.SOLUTION_HELLO,
			"pagination": problems.SOLUTION_PAGINATION,
		}
		solutionCode := solutionsMap[id]
		return c.JSON(fiber.Map{
			"code":      solutionCode,
			"problemId": id,
		})
	})

	app.Listen(":8000")
}
