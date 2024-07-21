import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  path: string;
  geolocation?: {
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  user: mongoose.Schema.Types.ObjectId;
  quest: mongoose.Schema.Types.ObjectId;
  order: number;
}

const PhotoSchema: Schema = new Schema({
  path: { type: String, required: true },
  geolocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', required: true },
  order: { type: Number, default: 0 }
});

export default mongoose.model<IPhoto>('Photo', PhotoSchema);
