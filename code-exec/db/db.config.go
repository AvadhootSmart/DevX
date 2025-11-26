package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//TODO: add this to env variable DATABASE_URL
// var dsn = "host=localhost user=gorm password=gorm dbname=gorm-devx port=5432 sslmode=disable TimeZone=Asia/Shanghai"
func ConnectDB() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to postgres db", err)
	}
	log.Println("Connected to postgres db")
	return db
}

