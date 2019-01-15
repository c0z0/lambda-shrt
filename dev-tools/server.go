package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", Handler)
	log.Println("Starting server on port ", ":3001")
	log.Fatal(http.ListenAndServe(":3001", nil))
}
