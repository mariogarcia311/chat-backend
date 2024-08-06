import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetSession } from './decorators/get-session.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('login')
  login(): string {
    return this.authService.login();
  }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('validate-otp')
  validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    return this.authService.validateOtp(validateOtpDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  private(@GetSession() session: any) {
    return {
      ...session,
    };
  }
}
