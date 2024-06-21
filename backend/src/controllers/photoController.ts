import { Request, Response } from 'express';
import { extractGeolocation } from '../services/geolocationService';
import { generateRoute } from '../services/routeService';
import Photo, { IPhoto } from '../models/photo';

export const uploadPhotos = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const photoPromises = files.map(async (file, index) => {
      const geolocation = await extractGeolocation(file.path);
      const photo = new Photo({ path: file.filename, geolocation, order: index });
      return photo.save();
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
    const photos = await Photo.find({}).sort({ order: 1 });
    res.status(200).send(photos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const resetPhotos = async (req: Request, res: Response) => {
  try {
    await Photo.deleteMany({});
    res.status(200).send({ message: 'All photos deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const createRoute = async (req: Request, res: Response) => {
  try {
    const route = await generateRoute();
    res.status(200).send(route);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};

export const updatePhotoOrder = async (req: Request, res: Response) => {
  try {
    const { order } = req.body;
    const updatePromises = order.map((photoId: string, index: number) =>
      Photo.findByIdAndUpdate(photoId, { order: index })
    );
    await Promise.all(updatePromises);
    res.status(200).send({ message: 'Order updated' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
};
