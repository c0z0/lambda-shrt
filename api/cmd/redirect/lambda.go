package main

import (
	"log"
	"net/http"

	"lshrt/data"
	"lshrt/utils"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		utils.Send404(&w)
		return
	}

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		log.Printf("Reached redirect id=[EMPTY]")
		utils.SendURLNotFound(w, "[EMPTY]")
	}

	log.Printf("Reached redirect id=%s\n", id)

	db := data.NewDB()
	defer db.Close()

	url := db.FindURL(id)

	if url != nil {
		log.Println("Redirecting to", url.Url)
		http.Redirect(w, r, url.Url, http.StatusMovedPermanently)
	} else {
		log.Println("Redirect 404")
		utils.SendURLNotFound(w, id)
	}
}
