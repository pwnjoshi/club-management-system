# Multi-stage build: Maven builder + lightweight JRE runtime
FROM maven:3.9.0-eclipse-temurin-17 AS builder
WORKDIR /workspace

# Copy pom and sources
COPY pom.xml ./
COPY src ./src

# Build the application (skip tests for faster builds)
RUN mvn -B -DskipTests package

# Runtime stage: lightweight JRE only
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /workspace/target/collegeclub-0.0.1-SNAPSHOT.jar app.jar

# Port is injected by Render via PORT env var
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
