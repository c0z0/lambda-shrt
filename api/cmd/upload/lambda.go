package main

import (
	"log"
	"lshrt/data"
	"lshrt/download"
	"lshrt/model"
	"lshrt/utils"
	"net/http"
	"strconv"

	"github.com/zemirco/uid"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		download.Handler(w, r)
		return
	}

	r.ParseMultipartForm(0)

	f := r.Form

	size, _ := strconv.Atoi(f["fileSize"][0])

	t := model.Transfer{Message: f["message"][0], SenderName: f["senderName"][0], FileSize: size}

	id := uid.New(6)

	fileName, url, err := utils.UploadFile(r, id)

	if err != nil {
		log.Print(err)
		w.Write([]byte("Error"))
		return
	}

	t.FBURL = url
	t.FileName = fileName
	t.Id = id

	db := data.NewDB()
	defer db.Close()

	t = db.CreateTransfer(t)

	utils.SendJSON(w, 200, t)
}
