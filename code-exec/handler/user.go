package handler

import (
	"code-exec/models"
	"code-exec/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func (h *DbHandler) GetUserById(c *fiber.Ctx) error {
	var user models.User
	if err := h.db.Where("id = ?", c.Params("id")).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func (h *DbHandler) GetUserByEmail(c *fiber.Ctx) error {
	var user models.User
	if err := h.db.Where("email = ?", c.Params("email")).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func (h *DbHandler) GetUsers(c *fiber.Ctx) error {
	var users []models.User
	if err := h.db.Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get users"})
	}

	return c.Status(fiber.StatusOK).JSON(users)
}

func MeHandler(c *fiber.Ctx) error {
	email := utils.GetEmailFromToken(c.Locals("user").(*jwt.Token))

	return c.Status(fiber.StatusOK).JSON(email)
}
