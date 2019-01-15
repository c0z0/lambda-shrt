package utils

import (
	"encoding/json"
	"html/template"
	"net/http"
)

func Send404(w *http.ResponseWriter) {

	(*w).WriteHeader(404)
	(*w).Header().Set("Content-Type", "text/html")
	(*w).Write([]byte(NotFoundPage))
}

func SendURLNotFound(w http.ResponseWriter, id string) {
	(w).WriteHeader(404)
	tmpl := template.Must(template.New("404").Parse(NotFoundUrl))

	tmpl.Execute(w, id)
}

func SendJSON(w http.ResponseWriter, status int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(response))
}
