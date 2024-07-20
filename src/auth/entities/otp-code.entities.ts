import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class OtpCode extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({
    type: Date,
    default: () => new Date(Date.now()),
    index: { expires: 60 * 1 },
  })
  expireAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const OtpCodeSchema = SchemaFactory.createForClass(OtpCode);
