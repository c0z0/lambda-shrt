cd api/cmd/$1

cp ../../../dev-tools/server.go .
cp ../../../dev-tools/.env .

go run *.go

rm server.go .env

cd ../../..

echo "Cleaned up"
