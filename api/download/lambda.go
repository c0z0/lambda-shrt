package download

import (
	"context"
	"io"
	"log"
	"lshrt/data"
	"lshrt/utils"
	"net/http"
	"strconv"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		utils.Send404(&w)
		return
	}

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		log.Printf("Reached download id=[EMPTY]")
		utils.Send404(&w)
	}

	log.Printf("Reached download id=%s\n", id)

	db := data.NewDB()

	defer db.Close()

	t := db.FindTransfer(id)

	if t != nil {
		objectName := "transfers/" + t.Id + "/" + t.FileName
		log.Printf("Proxying download id=%s objectName=%s\n", id, objectName)
		sendObject(w, objectName, t.FileName)
	} else {
		log.Println("Download 404")
		utils.Send404(&w)
	}
}

func sendObject(w http.ResponseWriter, objectName, fileName string) {
	bucket, _ := utils.GetClient().DefaultBucket()
	obj := bucket.Object(objectName)

	attr, err := obj.Attrs(context.Background())

	if err != nil {
		log.Fatal(err)
	}

	setStrHeader(w, "Content-Disposition", "attachment; filename=\""+fileName+"\"")
	setStrHeader(w, "Content-Type", attr.ContentType)
	setStrHeader(w, "Content-Language", attr.ContentLanguage)
	setStrHeader(w, "Cache-Control", attr.CacheControl)
	setStrHeader(w, "Content-Encoding", attr.ContentEncoding)
	setStrHeader(w, "Content-Disposition", attr.ContentDisposition)
	setIntHeader(w, "Content-Length", attr.Size)
	objr, err := obj.NewReader(context.Background())

	if err != nil {
		log.Fatal(err)
		return
	}
	io.Copy(w, objr)
}

func setStrHeader(w http.ResponseWriter, key string, value string) {
	if value != "" {
		w.Header().Add(key, value)
	}
}

func setIntHeader(w http.ResponseWriter, key string, value int64) {
	if value > 0 {
		w.Header().Add(key, strconv.FormatInt(value, 10))
	}
}
