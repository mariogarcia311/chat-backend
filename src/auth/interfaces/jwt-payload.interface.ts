import { Schema } from 'mongoose';

export interface JwtPayload {
  _id: any;
  userId: Schema.Types.ObjectId;
  device: string;
}
