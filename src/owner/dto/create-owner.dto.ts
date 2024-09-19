import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateOwnerDto {
  @IsOptional()
  @IsInt({ message: 'createdBy must be an integer' })
  createdBy?: number;

  @IsOptional()
  @IsInt({ message: 'updatedBy must be an integer' })
  updatedBy?: number;

  @IsInt({ message: 'UserID must be an integer' })
  @IsNotEmpty({ message: 'UserID cannot be empty' })
  UserID: number;
}
