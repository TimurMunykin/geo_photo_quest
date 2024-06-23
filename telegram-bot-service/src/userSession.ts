import { IPhoto } from './models/photo';

interface UserSession {
  currentPhotoIndex: number;
  photos: IPhoto[];
}

const userSessions: { [key: number]: UserSession } = {};

export const createSession = (chatId: number, photos: IPhoto[]) => {
  userSessions[chatId] = {
    currentPhotoIndex: 0,
    photos: photos,
  };
};

export const getSession = (chatId: number): UserSession | undefined => {
  return userSessions[chatId];
};

export const updateSession = (chatId: number, currentPhotoIndex: number) => {
  if (userSessions[chatId]) {
    userSessions[chatId].currentPhotoIndex = currentPhotoIndex;
  }
};

export const deleteSession = (chatId: number) => {
  delete userSessions[chatId];
};
