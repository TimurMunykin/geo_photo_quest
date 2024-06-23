import mongoose, { Schema, Document } from 'mongoose';

interface IQuest extends Document {
  token: string;
  user: mongoose.Schema.Types.ObjectId;
  photos: {
    path: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
    order: number;
  }[];
  createdAt: Date;
}

const QuestSchema: Schema<IQuest> = new Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photos: [
    {
      path: { type: String, required: true },
      geolocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      order: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuest>('Quest', QuestSchema);
