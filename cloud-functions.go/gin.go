package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var app *gin.Engine

func init() {
	gin.SetMode(gin.ReleaseMode)
	app = gin.New()

	app.GET("/api/gin", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message":   "Hello from Gin on Vercel!",
			"framework": "gin",
		})
	})

	app.GET("/api/gin/users", func(c *gin.Context) {
		name := c.Query("name")
		if name == "" {
			name = "World"
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, " + name + "!",
			"query":   c.Request.URL.RawQuery,
		})
	})

	app.POST("/api/gin", func(c *gin.Context) {
		var body map[string]interface{}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "POST received",
			"data":    body,
		})
	})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}
