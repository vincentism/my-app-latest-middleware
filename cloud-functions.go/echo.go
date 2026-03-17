package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	emw "github.com/labstack/echo/v4/middleware"
)

var e *echo.Echo

func init() {
	e = echo.New()
	e.Use(emw.Recover())

	e.GET("/api/echo", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"message":   "Hello from Echo on Vercel!",
			"framework": "echo",
		})
	})

	e.GET("/api/echo/users/:id", func(c echo.Context) error {
		id := c.Param("id")
		return c.JSON(http.StatusOK, map[string]string{
			"message": "User detail from Echo",
			"id":      id,
		})
	})

	e.POST("/api/echo", func(c echo.Context) error {
		var body map[string]interface{}
		if err := c.Bind(&body); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusOK, map[string]interface{}{
			"message": "POST received via Echo",
			"data":    body,
		})
	})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	e.ServeHTTP(w, r)
}
