package handler

import (
	"code-exec/models"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type DbHandler struct {
	db *gorm.DB
}

func NewDbHandler(db *gorm.DB) *DbHandler {
	return &DbHandler{db: db}
}

func (h *DbHandler) CreateProblem(c *fiber.Ctx) error {
	var req struct {
		ID          string   `json:"id"`
		Name        string   `json:"problem_name"`
		Description string   `json:"description"`
		Difficulty  string   `json:"difficulty"`
		Boilerplate string   `json:"boilerplate"`
		Topics      []string `json:"topics"`
	}

	//parse json
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid JSON"})
	}

	//convert topics to json
	topicsJSON, err := json.Marshal(req.Topics)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid topics"})
	}

	//validate request
	if req.ID == "" || req.Name == "" || req.Description == "" || req.Difficulty == "" || req.Boilerplate == "" || len(req.Topics) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required fields"})
	}

	if err := h.db.Where("id = ?", req.ID).First(&models.Problem{}).Error; err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Problem already exists"})
	}

	problem := models.Problem{
		ID:          req.ID,
		Name:        req.Name,
		Description: req.Description,
		Difficulty:  req.Difficulty,
		Boilerplate: req.Boilerplate,
		Topics:      datatypes.JSON(topicsJSON),
	}

	if err := h.db.Create(&problem).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(problem)
}

func (h *DbHandler) GetProblems(c *fiber.Ctx) error {
	var problems []models.Problem
	if err := h.db.Find(&problems).Error; err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get problems"})
	}

	if len(problems) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No problems found"})
	}

	return c.Status(fiber.StatusOK).JSON(problems)
}

func (h *DbHandler) GetProblemById(c *fiber.Ctx) error {
	var problem models.Problem
	if err := h.db.Where("id = ?", c.Params("id")).First(&problem).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Problem not found"})
	}

	return c.Status(fiber.StatusOK).JSON(problem)
}
