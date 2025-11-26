package models

type Submission struct {
	UserID uint `gorm:"foreignKey:user_id"`
	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
