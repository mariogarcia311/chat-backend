import { Global, Module } from '@nestjs/common';
import { BaileysService } from './baileys.service';
import { BaileysController } from './baileys.controller';

@Global()
@Module({
  providers: [BaileysService],
  exports: [BaileysService],
  controllers: [BaileysController],
})
export class BaileysModule {}
