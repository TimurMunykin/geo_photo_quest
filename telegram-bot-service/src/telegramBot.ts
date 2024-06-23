import TelegramBot from 'node-telegram-bot-api';
import Photo, { IPhoto } from './models/photo';
import Quest, { IQuest } from './models/quest';
import mongoose from 'mongoose';
import path from 'path';
import { FULL_URL } from './config';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/photoQuest';
mongoose.set('strictQuery', true);
mongoose.connect(mongoURI);

const botToken = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const bot = new TelegramBot(botToken, { polling: true });

// In-memory storage for user sessions
const userSessions: { [key: number]: { questId: string, currentPhotoIndex: number, photos: IPhoto[] } } = {};

// Start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to the Photo Geolocation Quest! Type /quest <token> to start a specific quest.");
});

// Select quest command
bot.onText(/\/quest (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match ? match[1] : null;

  if (!token) {
    bot.sendMessage(chatId, "Please provide a valid quest token. Usage: /quest <token>");
    return;
  }

  try {
    const quest: IQuest | null = await Quest.findOne({ token });
    const questlist = await Quest.where();
    console.log('*questlist',questlist)
    console.log('*token',token)
    console.log(`Fetched quest: ${JSON.stringify(quest)}`); // Log the quest details for debugging
    if (!quest) {
      bot.sendMessage(chatId, "Invalid quest token. Please try again.");
      return;
    }

    const photos: IPhoto[] = await Photo.find({ quest: quest._id }).sort({ order: 1 });
    if (photos.length === 0) {
      bot.sendMessage(chatId, "No photos available for this quest. Please try another quest.");
      return;
    }

    userSessions[chatId] = {
      questId: quest._id,
      currentPhotoIndex: 0,
      photos: photos,
    };

    bot.sendMessage(chatId, `Quest "${quest.name}" selected. Here is your first photo.`);
    sendPhoto(chatId);
  } catch (error: any) {
      console.error(`Error while selecting quest: ${error.message}`);
      bot.sendMessage(chatId, "An error occurred while selecting the quest. Please try again later.");
  }
});

// Function to send photo
const sendPhoto = (chatId: number) => {
  const userProgress = userSessions[chatId];
  if (!userProgress) {
    bot.sendMessage(chatId, "No active quest found. Please start a quest by using /quest <token>.");
    return;
  }

  const photo = userProgress.photos[userProgress.currentPhotoIndex];
  const photoPath = path.join(__dirname, '../../uploads', photo.path);

  bot.sendMessage(chatId, `${FULL_URL}/uploads/${photo.path}`);
  bot.sendPhoto(chatId, `${FULL_URL}/uploads/${photo.path}`, {
    caption: "Please send your location when you reach this point."
  });

  bot.once('location', (msg) => {
    const userLocation = msg.location;
    if (userLocation) {
      const { latitude, longitude } = photo.geolocation;
      const distance = getDistance(userLocation.latitude, userLocation.longitude, latitude, longitude);
      if (distance < 50) {
        userProgress.currentPhotoIndex += 1;
        if (userProgress.currentPhotoIndex < userProgress.photos.length) {
          bot.sendMessage(chatId, "Correct! Here is your next photo.");
          sendPhoto(chatId);
        } else {
          bot.sendMessage(chatId, "Congratulations! You have completed the quest.");
          delete userSessions[chatId];
        }
      } else {
        bot.sendMessage(chatId, "You are not at the correct location. Please try again.");
      }
    }
  });
};

// Function to calculate distance between two geolocations
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};
