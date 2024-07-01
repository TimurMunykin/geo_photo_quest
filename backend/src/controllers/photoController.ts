import { Request, Response } from 'express';
import { extractGeolocation } from '../services/geolocationService';
import Photo from '../models/photo';
import { IUser } from '../models/user';
import Quest from '../models/quest';
import mongoose from 'mongoose';

export const uploadPhotos = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { questId } = req.body;
    const userId = req.user?._id;

    const quest = await Quest.findById(questId);
    if (!quest) {
      return res.status(400).send({ message: 'Invalid quest ID' });
    }
    const photoPromises = files.map(async (file, index) => {
      let geolocation = null;
      const photoPath = file.filename;
      try {
        geolocation = await extractGeolocation(file.path);
      } catch (error: any) {
        console.warn(`Geolocation extraction failed for file ${file.filename}:`, error.message);
      }
      const photo = new Photo({ path: photoPath, geolocation, user: userId, quest: questId, order: index });
      return await photo.save();
    });

    const photos = await Promise.all(photoPromises);
    res.status(201).send(photos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const getPhotos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { questId } = req.query;
    const photos = await Photo.find({ user: userId, quest: questId });
    res.status(200).send(photos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const photoId = req.params.id;
    await Photo.findOneAndDelete({ _id: photoId, user: userId });
    res.status(200).send({ message: 'Photo deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const resetPhotos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    await Photo.deleteMany({ user: userId });
    res.status(200).send({ message: 'All photos deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const createRoute = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const photos = await Photo.find({ user: userId }).sort({ createdAt: 1 });
    const route = photos
      .filter(photo => photo.geolocation && photo.geolocation.latitude && photo.geolocation.longitude)
      .map(photo => ({
        latitude: photo.geolocation!.latitude,
        longitude: photo.geolocation!.longitude,
      }));
    res.status(200).send(route);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const updatePhotoOrder = async (req: Request, res: Response) => {
  const { order } = req.body;
  const userId = req.user?._id;

  try {
    for (const [index, photoId] of order.entries()) {
      await Photo.findOneAndUpdate({ _id: photoId, user: userId }, { order: index });
    }
    res.status(200).send({ message: 'Photo order updated' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};
