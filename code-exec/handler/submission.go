package handler

import (
	"code-exec/models"
	"code-exec/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func (h *DbHandler) SubmitProblem(c *fiber.Ctx) error {
	type Request struct {
		Code        string `json:"code"`
		ProblemPath string `json:"problem_path"`
		ProblemID   uint   `json:"problem_id"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		return err
	}

	if req.Code == "" || req.ProblemPath == "" || req.ProblemID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required fields"})
	}

	userEmail := utils.GetEmailFromToken(c.Locals("user").(*jwt.Token))

	var user models.User
	if err := h.db.Where("email = ?", userEmail).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	var problem models.Problem
	if err := h.db.Where("id = ?", req.ProblemID).First(&problem).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Problem not found"})
	}

	results, err := ExecCode(req.Code, req.ProblemPath, problem.Domain == "frontend", c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	submission := models.Submission{
		UserID:    user.ID,
		ProblemID: req.ProblemID,
		Result:    results,
		Code:      req.Code,
	}

	if err := h.db.Create(&submission).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create submission"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Submission created successfully", "results": results})
	// return nil
}

func (h *DbHandler) GetUserSubmissions(c *fiber.Ctx) error {
	userEmail := utils.GetEmailFromToken(c.Locals("user").(*jwt.Token))

	var user models.User
	if err := h.db.Where("email = ?", userEmail).Find(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	var submissions []models.Submission
	if err := h.db.Preload("Problem").Where("user_id = ?", user.ID).Find(&submissions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get submissions"})
	}

	return c.Status(fiber.StatusOK).JSON(submissions)
}
