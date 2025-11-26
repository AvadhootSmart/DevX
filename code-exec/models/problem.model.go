package models

import "gorm.io/datatypes"

type Problem struct {
	// ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	ID 			string   `gorm:"primaryKey" json:"id"`
	Name        string   `json:"problem_name"`
	Description string 	 `json:"description"`
	Difficulty  string	 `json:"difficulty"`
	Boilerplate string	 `json:"boilerplate"`
	// Tests       []Test   `gorm:"foreignKey:ProblemID"`
	Topics      datatypes.JSON `gorm:"type:json" json:"topics"`
} 

type Test struct {
	ID         uint      `gorm:"primaryKey"`
	ProblemID  string 	 `gorm:"type:string"`
	Input      string
	Output     string
	Explanation string
}

