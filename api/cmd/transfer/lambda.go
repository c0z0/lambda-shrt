package main

import (
	"log"
	"lshrt/data"
	"lshrt/utils"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		utils.Send404(&w)
		return
	}

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		log.Printf("Reached transfer id=[EMPTY]")
		utils.SendURLNotFound(w, "[EMPTY]")
	}

	log.Printf("Reached transfer id=%s\n", id)

	db := data.NewDB()
	defer db.Close()

	t := db.FindTransfer(id)

	if t != nil {
		log.Println("Transfer sending ", id)
		utils.SendJSON(w, 200, t)
	} else {
		log.Println("Transfer 404")
		utils.SendURLNotFound(w, id)
	}
}
