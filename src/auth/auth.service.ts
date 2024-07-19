import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entities';
import { Model } from 'mongoose';
import { BaileysService } from 'src/baileys/baileys.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private baileysService: BaileysService,
  ) {}
  login(): string {
    return 'Hello World!';
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const newUser = { ...registerUserDto, enabled: false };
      const resp = await this.userModel.create(newUser);
      this.baileysService.sendMessage('57', '3127324260', 'hola');
      return resp;
    } catch (error) {
      throw new InternalServerErrorException(error._message, {
        cause: error,
        description: error.message,
      });
    }
  }
}
