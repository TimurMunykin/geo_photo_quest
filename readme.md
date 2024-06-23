
# Photo Location Quest

Photo Location Quest is a web application that allows users to create and share quests based on photo geolocation EXIF data.

## Features

- User registration and authentication
- Upload photos and extract geolocation data
- Create routes based on photo locations
- Manage and reorder photo points
- Share routes with others

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/photo-location-quest.git
   cd photo-location-quest
   ```

2. Create a `.env` file in the `backend` directory based on `.env_template`:

   ```plaintext
   BE_PORT=3000
   FE_PORT=5000
   HOST=http://your_site_or_ip_here.com
   TELEGRAM_BOT_TOKEN=your_secret_token_here
   MONGO_URI=mongodb://db:27017/photoQuest
   JWT_SECRET=your_secret_key_here
   ```

3. Start the development environment:

   ```bash
   ./run.dev.sh
   ```

### Production Setup

1. Build and start the production environment:

   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

## Usage

1. Register or login to the application.
2. Upload photos with geolocation data.
3. Manage and reorder photo points to create a route.
4. Share the route with others.

## Telegram Bot

A Telegram bot is integrated with the application to guide users through the quests. Make sure to set up the `TELEGRAM_BOT_TOKEN` in the `.env` file.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
