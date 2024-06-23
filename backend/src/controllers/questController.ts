import { Request, Response } from 'express';
import Quest from '../models/quest';
import crypto from 'crypto';

// Function to generate a unique token
const generateToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

export const createQuest = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const token = generateToken();
    const quest = new Quest({ name, token });
    await quest.save();

    res.status(201).send(quest);
  } catch (error) {
    console.error('Error creating quest:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const getQuests = async (req: Request, res: Response) => {
  try {
    const quests = await Quest.find();
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
