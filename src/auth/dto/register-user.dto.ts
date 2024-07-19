import { IsOptional, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(8, 15)
  readonly cellPhone: string;

  @IsString()
  @Length(1, 3)
  readonly codeCountry: string;

  @IsString()
  readonly userName: string;

  @IsOptional()
  @IsString()
  readonly description: string = '';

  @IsOptional()
  @IsString()
  readonly profilePicture: string = '';
}
