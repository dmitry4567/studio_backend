import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsISO8601, IsInt, IsNotEmpty } from 'class-validator';
import { IsNull } from 'typeorm';

export class ChooseTimeSessionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  from: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  until: number;
}
