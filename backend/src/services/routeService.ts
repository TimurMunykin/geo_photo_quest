import Photo, { IPhoto } from '../models/photo';
import OpenAI from 'openai';

export const generateRoute = async (): Promise<{ latitude: number; longitude: number }[]> => {
  const photos: IPhoto[] = await Photo.find({}).sort({ order: 1 });
  const route = photos.map(photo => ({
    latitude: photo.geolocation.latitude,
    longitude: photo.geolocation.longitude,
  }));
  return route;
};


// export const generateRoute = async (photos: IPhoto[]): Promise<any> => {
//   const openai = new OpenAI({
//       // apiKey: process.env[''],
//       apiKey: '',
//   });
//   const locations = photos.map(photo => ({
//     latitude: photo.geolocation.latitude,
//     longitude: photo.geolocation.longitude
//   }));


//   // console.log(JSON.stringify(locations))
//   // return null

//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: `Create a route from these locations: ${JSON.stringify(locations)}` }],
//     // model: "gpt-4o",
//     model: "gpt-3.5-turbo-0125",
//   });

//   console.log(`Create a route from these locations: ${JSON.stringify(locations)}`)
//   console.log(completion.choices[0])
//   return completion.choices[0];
// };
