package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:uniqueIndex`
	Password string
	Email string `gorm:"uniqueIndex"`
	Submissions []Submission `gorm:"foreignKey:UserID"`
}
