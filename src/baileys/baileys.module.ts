import { Module } from '@nestjs/common';
import { BaileysService } from './baileys.service';

@Module({
  providers: [BaileysService],
  exports: [BaileysService],
})
export class BaileysModule {}
