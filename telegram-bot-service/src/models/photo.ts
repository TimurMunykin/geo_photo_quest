import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  path: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  order: number;
}

const PhotoSchema: Schema = new Schema({
  path: { type: String, required: true },
  geolocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  order: { type: Number, default: 0 }
});

export default mongoose.model<IPhoto>('Photo', PhotoSchema);
