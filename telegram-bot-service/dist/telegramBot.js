"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const photo_1 = __importDefault(require("./models/photo"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/photoQuest';
mongoose_1.default.connect(mongoURI);
const botToken = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const bot = new node_telegram_bot_api_1.default(botToken, { polling: true });
// Start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to the Photo Geolocation Quest! Type /play to start the game.");
});
// Play command
bot.onText(/\/play/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const photos = yield photo_1.default.find({}).sort({ order: 1 });
    if (photos.length === 0) {
        bot.sendMessage(chatId, "No photos available to create a quest. Please upload photos first.");
        return;
    }
    const userProgress = {
        currentPhotoIndex: 0,
        photos: photos,
    };
    bot.sendMessage(chatId, "Starting your quest. Here is your first location.");
    sendPhotoLocation(chatId, userProgress);
}));
// Function to send photo location
const sendPhotoLocation = (chatId, userProgress) => {
    const photo = userProgress.photos[userProgress.currentPhotoIndex];
    const { latitude, longitude } = photo.geolocation;
    bot.sendLocation(chatId, latitude, longitude);
    bot.sendMessage(chatId, "Please send your location when you reach this point.");
    bot.on('location', (msg) => {
        const userLocation = msg.location;
        if (userLocation) {
            const distance = getDistance(userLocation.latitude, userLocation.longitude, latitude, longitude);
            if (distance < 50) {
                userProgress.currentPhotoIndex += 1;
                if (userProgress.currentPhotoIndex < userProgress.photos.length) {
                    bot.sendMessage(chatId, "Correct! Here is your next location.");
                    sendPhotoLocation(chatId, userProgress);
                }
                else {
                    bot.sendMessage(chatId, "Congratulations! You have completed the quest.");
                }
            }
            else {
                bot.sendMessage(chatId, "You are not at the correct location. Please try again.");
            }
        }
    });
};
// Function to calculate distance between two geolocations
const getDistance = (lat1, lon1, lat2, lon2) => {
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
