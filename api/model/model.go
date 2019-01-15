package model

type Url struct {
	Url string `json:"url"`
	Id  string `json:"id"`
}

type Transfer struct {
	FBURL      string `json:"fburl"`
	Message    string `json:"message"`
	SenderName string `json:"senderName"`
	FileName   string `json:"fileName"`
	FileSize   int    `json:"fileSize"`
	Id         string `json:"_id"`
}
