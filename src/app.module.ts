import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { BaileysModule } from './baileys/baileys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get<string>('db.user')}:${configService.get<string>('db.password')}@chatcluster.zrfoocy.mongodb.net/${configService.get<string>('db.name')}`,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BaileysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
