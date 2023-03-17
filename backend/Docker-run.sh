docker rm foodstashApp
docker run -it --rm --name foodstashApp -p 8080:8080 food_image:1 java -jar /opt/foodstashApi/foodstashApi.jar
