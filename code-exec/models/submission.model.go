package models

import "gorm.io/gorm"


type Result struct {
	NumTotalTests int `json:"numTotalTests"`
	NumPassedTests int `json:"numPassedTests"`
	NumFailedTests int `json:"numFailedTests"`
}

type Submission struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`

	ProblemID uint
	Problem   Problem `gorm:"foreignKey:ProblemID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Result Result `gorm:"embedded"`

	Code string
}
