import { Request, Response } from 'express';
import Quest from '../models/quest';
import { generateToken } from '../utils/token';

export const createQuest = async (req: Request, res: Response) => {
  try {
    const { photos } = req.body;
    const userId = req.user?._id;

    const token = generateToken();
    const quest = new Quest({ token, user: userId, photos });
    await quest.save();

    res.status(201).send({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const getQuest = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const quest = await Quest.findOne({ token });

    if (!quest) {
      return res.status(404).send({ message: 'Quest not found' });
    }

    res.status(200).send(quest);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const getAllQuests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const quests = await Quest.find({ user: userId });

    res.status(200).send(quests);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};
