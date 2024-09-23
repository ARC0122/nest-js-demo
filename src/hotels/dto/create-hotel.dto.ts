import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty({ message: 'Hotel name cannot be empty' })
  hotelName: string;

  @IsNotEmpty({ message: 'City cannot be empty' })
  city: string;

  @IsInt({ message: 'OwnerID must be an integer' })
  @IsNotEmpty({ message: 'OwnerID cannot be empty' })
  OwnerID: number;

  @IsOptional()
  @IsInt({ message: 'createdBy must be an integer' })
  createdBy?: number;

  @IsOptional()
  @IsInt({ message: 'updatedBy must be an integer' })
  updatedBy?: number;
}
