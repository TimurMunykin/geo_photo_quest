import { Request, Response } from 'express';
import Quest from '../models/quest';
import crypto from 'crypto';
import Photo from '../models/photo';

// Function to generate a unique token
const generateToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

export const createQuest = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const token = generateToken();
    const userId = req.user?._id;
    const quest = new Quest({ name, token, user: userId });
    await quest.save();

    res.status(201).send(quest);
  } catch (error) {
    console.error('Error creating quest:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const getQuests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const quests = await Quest.find({ user: userId });
    res.status(200).send(quests);
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const deleteQuest = async (req: Request, res: Response) => {
  try {
    const questId = req.params.id;
    await Quest.findOneAndDelete({ _id: questId });
    res.status(200).send({ message: 'Quest deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const getQuestWithPhotos = async (req: Request, res: Response) => {
  const questId = req.params.id;

  try {
    const quest = await Quest.findById(questId);
    if (!quest) {
      return res.status(404).send({ message: 'Quest not found' });
    }

    const photos = await Photo.find({ quest: questId });
    res.status(200).send({ quest, photos });
  } catch (error) {
    console.error('Error fetching quest with photos:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};