import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
// import { User } from '../entities/user.entities';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '../entities/session.entities';
import { User } from '../entities/user.entities';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('auth.jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { _id, userId } = payload;
    const session = await this.sessionModel.findOne({ _id, userId });
    if (!session) throw new UnauthorizedException('Token not valid');
    return;
  }
}
