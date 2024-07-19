import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  // id: string // Mongo me lo da
  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  @Prop({ required: true })
  cellPhone: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  userName: string;

  @Prop({})
  description: string;

  @Prop({})
  profilePicture: string;

  @Prop({ required: true })
  enabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
