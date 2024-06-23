import mongoose, { Schema, Document } from 'mongoose';

export interface IQuest extends Document {
  name: string;
  token: string;
}

const QuestSchema: Schema<IQuest> = new Schema({
  name: { type: String, required: true },
  token: { type: String, required: true, unique: true },
});

export default mongoose.model<IQuest>('Quest', QuestSchema);
