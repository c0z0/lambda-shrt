package main

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"

	"lshrt/data"
	"lshrt/model"
	"lshrt/utils"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		utils.Send404(&w)
		return
	}

	decoder := json.NewDecoder(r.Body)

	url := model.Url{}

	if err := decoder.Decode(&url); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad request"))
		return
	}

	url.Url = fixURL(url.Url)

	db := data.NewDB()
	defer db.Close()

	log.Println("Shortening", url.Url)

	url = db.CreateURL(url.Url)

	utils.SendJSON(w, 200, url)
}

func fixURL(url string) string {
	if matched, _ := regexp.Match("(^http://|https://).+", []byte(url)); matched {
		return url
	}
	return "https://" + url
}
