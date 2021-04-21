echo setting gcloud context

gcloud config set project life-212607 && gcloud container clusters get-credentials mischool-web-cluster --zone=asia-southeast1-c

echo building mischool-web with tag $1

docker build -t asia.gcr.io/life-212607/mischool-web:$1 . && 
    \ docker push asia.gcr.io/life-212607/mischool-web:$1 && 
    \ kubectl set image deployment/mischool-web-master mischool-web=asia.gcr.io/life-212607/mischool-web:$1

echo deployment complete

echo please manually clear the cloudflare cache with the CURL command
