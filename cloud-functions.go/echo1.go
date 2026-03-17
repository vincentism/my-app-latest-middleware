package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.HideBanner = true

	e.Use(middleware.Recover())

	e.GET("/api/echo", func(c echo.Context) error {
		return c.JSON(http.StatusOK, echo.Map{
			"message":   "Hello from Echo!",
			"framework": "echo",
		})
	})

	e.GET("/api/echo/users/:id", func(c echo.Context) error {
		id := c.Param("id")
		return c.JSON(http.StatusOK, echo.Map{
			"message": "User detail from Echo",
			"id":      id,
		})
	})

	e.POST("/api/echo", func(c echo.Context) error {
		var body map[string]interface{}
		if err := c.Bind(&body); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
		}
		return c.JSON(http.StatusOK, echo.Map{
			"message": "POST received via Echo",
			"data":    body,
		})
	})

	port := "9000"
	fmt.Printf("Echo server starting on :%s\n", port)
	s := &http.Server{
		Addr:         ":" + port,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	log.Fatal(e.StartServer(s))
}