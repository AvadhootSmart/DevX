package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Problem struct {
	gorm.Model
	Path        string   `gorm:"uniqueIndex" json:"path"`
	Name        string   `gorm:"uniqueIndex" json:"problem_name"`
	Description string 	 `json:"description"`
	Difficulty  string	 `json:"difficulty"`
	Boilerplate string	 `json:"boilerplate"`
	Topics      datatypes.JSON `gorm:"type:json" json:"topics"`
	// Submissions []Submission `gorm:"foreignKey:ProblemID"`
	// Tests       []Test   `gorm:"foreignKey:ProblemID"`
} 

type Test struct {
	ID         uint      `gorm:"primaryKey"`
	ProblemID  string 	 `gorm:"type:string"`
	Input      string
	Output     string
	Explanation string
}

