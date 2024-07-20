import { IsMongoId, IsString, Length } from 'class-validator';

export class ValidateOtpDto {
  @IsMongoId()
  readonly userId: string;

  @IsString()
  readonly device: string;

  @IsString()
  @Length(6)
  readonly code: string;
}
