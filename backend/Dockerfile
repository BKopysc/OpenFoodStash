#Stage 1

FROM maven:3.8.7-eclipse-temurin-17-alpine as stage1
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
WORKDIR /opt/foodstashApi
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
RUN mvn clean install -Dmaven.test.skip=true

#Stage 2

FROM eclipse-temurin:17-jre-alpine
WORKDIR /opt/foodstashApi
COPY --from=stage1 /opt/foodstashApi/target/foodstashApi.jar /opt/foodstashApi
COPY domain-cert.p12 .
