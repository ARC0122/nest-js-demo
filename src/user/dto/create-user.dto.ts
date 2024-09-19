import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsAlpha,
  Length,
  IsNumber,
  IsString,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsAlpha(undefined, { message: 'First name must contain only letters' })
  FName: string;

  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsAlpha(undefined, { message: 'Last name must contain only letters' })
  LName: string;

  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  Email: string;

  @IsString({ message: 'Mobile must be a string' })
  @Length(10, 10, { message: 'Mobile number must be 10 digits' })
  @Matches(/^\d+$/, { message: 'Mobile number must contain only numbers' })
  Mobile: string;

  @IsEnum(['male', 'female', 'other'], {
    message: "Gender must be either 'male', 'female', or 'other'",
  })
  Gender: string;

  @IsInt({ message: 'createdBy must be an integer' })
  @IsOptional()
  createdBy?: number;

  @IsInt({ message: 'updatedBy must be an integer' })
  @IsOptional()
  updatedBy?: number;
}
