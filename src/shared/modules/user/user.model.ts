import {Schema, model, Document} from 'mongoose';
import { User } from '../../types/index.js';

interface userDocument extends Document, User {
  createdAt: Date,
  updatedAt: Date
}

const userSchema = new Schema<userDocument>({
  name: String,
  email: String,
  avatar: String,
  type: String,
}, {timestamps: true});

export const UserModel = model<userDocument>('User', userSchema);
