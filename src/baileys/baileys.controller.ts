import { Body, Controller, Post } from '@nestjs/common';
import { BaileysService } from './baileys.service';

@Controller('baileys')
export class BaileysController {
  constructor(private readonly baileyService: BaileysService) {}
  @Post('sendWhatsapp')
  sendWhatsapp(@Body() registerUserDto: any) {
    const { countryCode, cellphoneNumber, message } = registerUserDto;
    this.baileyService.sendMessage(countryCode, cellphoneNumber, message);
    return { countryCode, cellphoneNumber, message };
  }
}
