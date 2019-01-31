package main

import (
	"log"
	"net/http"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func mw(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	Handler(w, r)
}

func main() {
	http.HandleFunc("/", mw)
	log.Println("Starting server on port ", ":3001")
	log.Fatal(http.ListenAndServe(":3001", nil))
}
