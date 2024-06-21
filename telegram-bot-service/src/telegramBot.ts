import TelegramBot from 'node-telegram-bot-api';
import Photo, { IPhoto } from './models/photo';
import mongoose from 'mongoose';
import path from 'path';
import { FULL_URL } from './config';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/photoQuest';
mongoose.set('strictQuery', true);
mongoose.connect(mongoURI);


const botToken = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const bot = new TelegramBot(botToken, { polling: true });

// Start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to the Photo Geolocation Quest! Type /play to start the game.");
});

// Play command
bot.onText(/\/play/, async (msg) => {
  const chatId = msg.chat.id;
  const photos: IPhoto[] = await Photo.find({}).sort({ createdAt: 1 });

  if (photos.length === 0) {
    bot.sendMessage(chatId, "No photos available to create a quest. Please upload photos first.");
    return;
  }

  // Save user progress in memory (for simplicity)
  const userProgress = {
    currentPhotoIndex: 0,
    photos: photos,
  };

//   console.log(`Starting quest for user ${photos}`);
  bot.sendMessage(chatId, "Starting your quest. Here is your first photo.");
  sendPhoto(chatId, userProgress);
});

// Function to send photo
const sendPhoto = (chatId: number, userProgress: any) => {
  const photo = userProgress.photos[userProgress.currentPhotoIndex];
  const photoPath = path.join(__dirname, '../../uploads', photo.path);

  console.log(`Sending photo ${FULL_URL}${photoPath}`);

  bot.sendPhoto(chatId, `${FULL_URL}/${photoPath}`, {
    caption: "Please send your location when you reach this point."
  });

  // Save user progress in memory (for simplicity)
  bot.on('location', (msg) => {
    const userLocation = msg.location;

    if (userLocation) {
      const { latitude, longitude } = photo.geolocation;
      const distance = getDistance(userLocation.latitude, userLocation.longitude, latitude, longitude);
      if (distance < 50) { // Assuming 50 meters as an acceptable distance
        userProgress.currentPhotoIndex += 1;
        if (userProgress.currentPhotoIndex < userProgress.photos.length) {
          bot.sendMessage(chatId, "Correct! Here is your next photo.");
          sendPhoto(chatId, userProgress);
        } else {
          bot.sendMessage(chatId, "Congratulations! You have completed the quest.");
        }
      } else {
        bot.sendMessage(chatId, "You are not at the correct location. Please try again.");
      }
    }
  });
};

// Function to calculate distance between two geolocations
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Earth radius in meters
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters
  return distance;
};
