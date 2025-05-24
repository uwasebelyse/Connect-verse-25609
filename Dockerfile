# Use an official OpenJDK 17 image as the base image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and related files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Install dependencies and build the project
RUN ./mvnw dependency:go-offline

# Copy the entire project into the container
COPY . .

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose the port your application runs on (default for Spring Boot is 8080)
EXPOSE 8080

# Set the command to run the application
CMD ["java", "-jar", "target/connectverse-0.0.1-SNAPSHOT.jar"]