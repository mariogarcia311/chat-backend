import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  device: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
