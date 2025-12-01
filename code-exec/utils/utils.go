package utils

import (
	"github.com/golang-jwt/jwt/v5"
)

func GetEmailFromToken(token *jwt.Token) string {
	claims := token.Claims.(jwt.MapClaims)
	email := claims["email"].(string)

	return email
}
