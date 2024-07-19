import mongoose, { Schema, Document } from 'mongoose';

export interface IQuest extends Document {
  name: string;
  token: string;
  user: mongoose.Schema.Types.ObjectId;
}

const QuestSchema: Schema<IQuest> = new Schema({
  name: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IQuest>('Quest', QuestSchema);
