import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import photoRoutes from './routes/photoRoutes';
import authRoutes from './routes/authRoutes';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Ensure uploads directory exists and has correct permissions
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
fs.chmodSync(uploadsDir, 0o755);

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/photos', photoRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
