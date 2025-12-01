package models

import "gorm.io/gorm"

type Submission struct {
	gorm.Model
	UserID uint 
	User User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	ProblemID uint 
	Problem Problem `gorm:"foreignKey:ProblemID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Code string 
}
