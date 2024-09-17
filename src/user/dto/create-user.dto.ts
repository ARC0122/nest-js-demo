import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  FName: string;

  @IsString()
  @IsNotEmpty()
  LName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @IsString()
  Mobile: string;

  @IsString()
  Gender: string;
}
