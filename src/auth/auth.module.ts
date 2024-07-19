import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entities';
import { BaileysModule } from 'src/baileys/baileys.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BaileysModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
