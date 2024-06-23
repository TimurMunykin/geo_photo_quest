import TelegramBot from 'node-telegram-bot-api';
import Quest from './models/quest';
import mongoose from 'mongoose';
import path from 'path';
import { FULL_URL } from './config';
import { IPhoto } from './models/photo';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/photoQuest';
mongoose.set('strictQuery', true);
mongoose.connect(mongoURI);

const botToken = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const bot = new TelegramBot(botToken, { polling: true });

interface UserProgress {
  currentPhotoIndex: number;
  photos: IPhoto[];
}

const sessions: Map<number, UserProgress> = new Map();

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to the Photo Geolocation Quest! Type /play <token> to start the game.");
});

bot.onText(/\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match?.[1];

  const quest = await Quest.findOne({ token }).populate('photos');

  if (!quest) {
    bot.sendMessage(chatId, "Invalid token. Please try again.");
    return;
  }

  const userProgress: UserProgress = {
  currentPhotoIndex: 0,
  photos: quest.photos as unknown as IPhoto[], // Type cast to match the interface
};

  sessions.set(chatId, userProgress);
  bot.sendMessage(chatId, "Starting your quest. Here is your first photo.");
  sendPhoto(chatId);
});

const sendPhoto = (chatId: number) => {
  const userProgress = sessions.get(chatId);
  if (!userProgress) return;

  const photo = userProgress.photos[userProgress.currentPhotoIndex];
  console.log('***photo', photo);
  console.log('***userProgress.photos', userProgress.photos);
  if (!photo) return;
  const photoPath = path.join(__dirname, '../../uploads', photo.path);

  bot.sendPhoto(chatId, `${FULL_URL}/${photoPath}`, {
    caption: "Please send your location when you reach this point.",
  });
};

bot.on('location', (msg) => {
  const chatId = msg.chat.id;
  const userProgress = sessions.get(chatId);
  if (!userProgress) return;

  const userLocation = msg.location;
  if (userLocation) {
    const photo = userProgress.photos[userProgress.currentPhotoIndex];
    const { latitude, longitude } = photo.geolocation;
    const distance = getDistance(userLocation.latitude, userLocation.longitude, latitude, longitude);
    if (distance < 50) {
      userProgress.currentPhotoIndex += 1;
      if (userProgress.currentPhotoIndex < userProgress.photos.length) {
        sessions.set(chatId, userProgress); // Update session
        bot.sendMessage(chatId, "Correct! Here is your next photo.");
        sendPhoto(chatId);
      } else {
        bot.sendMessage(chatId, "Congratulations! You have completed the quest.");
        sessions.delete(chatId); // Remove session
      }
    } else {
      bot.sendMessage(chatId, "You are not at the correct location. Please try again.");
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

  return R * c;
};
