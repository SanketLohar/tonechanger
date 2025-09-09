# Use an official OpenJDK 17 runtime as a parent image
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory in the container
WORKDIR /app

# --- NEW LINE ---
# Configure Maven to use less memory during the build
ENV MAVEN_OPTS="-Xmx512m"

# Copy the Maven wrapper and project definition files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Build the project dependencies. This creates a layer that is cached.
RUN ./mvnw dependency:go-offline

# Copy the rest of your application's source code
COPY src ./src

# Package the application
RUN ./mvnw package -DskipTests

# Expose port 8080 to the outside world
EXPOSE 8080

# The command to run your application
ENTRYPOINT ["java", "-jar", "target/tonechanger-0.0.1-SNAPSHOT.jar"]