
# Geo Photo Quest Project

## Project Description

The "Geo Photo Quest" project is a web application that allows users to participate in photo-based geolocation quests. The application uses a combination of frontend and backend technologies to provide an engaging and interactive user experience. The tech stack includes:

- **Frontend:** React, Tailwind CSS, Material-UI
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Docker, NGINX

## Architecture Overview

1. **Frontend Service:**
   - Built with React, Tailwind CSS, and Material-UI.
   - Communicates with the backend via RESTful APIs.
   - Dockerized with a multi-stage Dockerfile for production builds.

2. **Backend Service:**
   - Built with Node.js and Express.
   - Handles business logic, API endpoints, and database interactions.
   - Includes routes for user authentication, photo upload, quest management, and geolocation services.
   - Dockerized with a Dockerfile for development and production environments.

3. **Database Service:**
   - MongoDB for storing user data, photos, quests, and geolocation information.
   - Managed via Docker Compose for seamless integration with other services.

4. **NGINX Service:**
   - Serves the frontend static files.
   - Acts as a reverse proxy for the backend service.
   - Configured for SSL termination and HTTP to HTTPS redirection.

5. **CI/CD Pipeline:**
   - Automated testing, building, and deployment using GitHub Actions.
   - Docker containers for consistent environments.

## Deployment Details

This architecture ensures scalability, maintainability, and high availability for the web application while providing an interactive experience through the Telegram bot.
