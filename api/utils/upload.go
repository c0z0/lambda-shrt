package utils

import (
	"context"
	"io"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go"
	storage "firebase.google.com/go/storage"
	_ "github.com/joho/godotenv/autoload"
	"google.golang.org/api/option"
)

func GetClient() *storage.Client {
	config := &firebase.Config{
		StorageBucket: "shrt-cf7a3.appspot.com",
	}

	opt := option.WithCredentialsJSON([]byte(os.Getenv("FB_JSON")))

	app, err := firebase.NewApp(context.Background(), config, opt)
	if err != nil {
		log.Fatal(err)
	}

	client, err := app.Storage(context.Background())

	if err != nil {
		log.Fatal(err)
	}

	return client
}

func UploadFile(r *http.Request, id string) (string, string, error) {
	client := GetClient()

	bucket, err := client.DefaultBucket()
	if err != nil {
		return "", "", err
	}

	file, header, err := r.FormFile("file")

	if err != nil {
		return "", "", err
	}

	defer file.Close()

	fileName := header.Filename

	log.Printf("Uploading %s/%s", id, fileName)

	wc := bucket.Object("transfers/" + id + "/" + fileName).NewWriter(context.Background())

	if _, err = io.Copy(wc, file); err != nil {
		return "", "", err
	}
	if err := wc.Close(); err != nil {
		return "", "", err
	}

	return fileName, "/d/" + id, nil
}
