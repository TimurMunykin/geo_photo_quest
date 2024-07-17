import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: password });
    await user.save();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log('User:', user);
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    console.log('Plaintext password:', `${username} --- ${password}`);
    console.log('Stored hash:', user.password);

    // const regenerated = await bcrypt.hash(password, 10)

    // console.log('!regenerated password:', regenerated);

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};
