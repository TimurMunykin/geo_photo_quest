import {ExifParserFactory, ExifTags} from "ts-exif-parser";
import fs from 'fs';

export const extractGeolocation = (filePath: string): Promise<{ latitude: number, longitude: number }> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      const parser = ExifParserFactory.create(data);
      const Data = ExifParserFactory.create(data).parse();
      const { GPSLatitude, GPSLongitude } = Data.tags as ExifTags;

      if (GPSLatitude && GPSLongitude) {
        resolve({ latitude: GPSLatitude, longitude: GPSLongitude });
      } else {
        reject(new Error('Geolocation data not found'));
      }
    });
  });
};
