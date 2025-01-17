import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entities';
import { Model } from 'mongoose';
import { BaileysService } from 'src/baileys/baileys.service';
import { OtpCode } from './entities/otp-code.entities';
import { generateOtp, textOtpMessage } from './utils/generateOtp';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { Session } from './entities/session.entities';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(OtpCode.name) private otpCodeModel: Model<OtpCode>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private readonly baileysService: BaileysService,
    private readonly jwtService: JwtService,
  ) {}
  login(): string {
    return 'Hello World!';
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const { cellPhone, countryCode } = registerUserDto;
      const newUser = {
        ...registerUserDto,
        completePhone: countryCode + cellPhone,
        enabled: false,
      };

      const existingUser = await this.userModel.findOne({
        cellPhone,
        countryCode,
        completePhone: countryCode + cellPhone,
      });

      const user = existingUser ?? (await this.userModel.create(newUser));
      const otp = generateOtp();
      const userId = user._id;
      const otpCreated = await this.otpCodeModel.create({
        userId: userId,
        code: otp,
      });
      this.baileysService.sendMessage(
        user.countryCode,
        user.cellPhone,
        textOtpMessage(otpCreated.code),
      );
      return {
        userId: otpCreated.userId,
      };
    } catch (error) {
      throw new InternalServerErrorException(error._message, {
        cause: error,
        description: error.message,
      });
    }
  }

  async validateOtp(validateOtpDto: ValidateOtpDto) {
    try {
      const { userId, code, device } = validateOtpDto;
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const validateOtp = await this.otpCodeModel
        .findOne({ userId: user._id, code })
        .exec();

      if (!validateOtp) {
        throw new NotFoundException('Code Not found');
      }

      const newUser = await this.userModel.findByIdAndUpdate(
        user._id,
        { enabled: true },
        {
          new: true,
        },
      );
      await this.sessionModel.findOneAndDelete({ userId });
      await this.sessionModel.findOneAndDelete({ device });
      const session = await this.sessionModel.create({ device, userId });
      const sessionData = {
        device: session.device,
        userId: session.userId,
        _id: session._id,
        completePhone: user.completePhone, // Añade otros campos que necesites
      };

      return {
        token: this.getJwt(sessionData),
        session: session,
        user: newUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred',
        error.message,
      );
    }
  }

  private getJwt(payLoad: JwtPayload) {
    const token = this.jwtService.sign(JSON.parse(JSON.stringify(payLoad)));
    return token;
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
