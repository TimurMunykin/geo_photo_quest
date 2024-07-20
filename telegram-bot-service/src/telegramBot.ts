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

const userSessions: { [key: number]: { questId: string, currentPhotoIndex: number, photos: IPhoto[] } } = {};

bot.onText(/\/start (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const token = match ? match[1] : null;

  bot.sendMessage(chatId, `chatID: ___${chatId}___`);

  if (!token) {
    bot.sendMessage(chatId, "Please provide a valid quest token. Usage: /quest <token>");
    return;
  }

  try {
    bot.sendMessage(chatId, `Quest token: ${token}`);
    const quest: IQuest | null = await Quest.findOne({ token });
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

bot.on('location', (msg) => {
  const userLocation = msg.location;
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `chatID: ___${chatId}___`);

  if (userLocation) {
    const userProgress = userSessions[chatId];
    const photo = userProgress.photos[userProgress.currentPhotoIndex];
    if (photo.geolocation && photo.geolocation.latitude && photo.geolocation.longitude) {
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
    } else {
      bot.sendMessage(chatId, "No geolocation found for this photo. Please try again.");
    }
  }
});

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

const sendPhoto = (chatId: number) => {
  const userProgress = userSessions[chatId];
  if (!userProgress) {
    bot.sendMessage(chatId, "No active quest found. Please start a quest by using /quest <token>.");
    return;
  }

  const photo = userProgress.photos[userProgress.currentPhotoIndex];

  console.log(chatId, `${FULL_URL}/uploads/${photo.path}`);
  bot.sendPhoto(chatId, `${FULL_URL}/uploads/${photo.path}`, {
    caption: "Please send your location when you reach this point."
  });
};
