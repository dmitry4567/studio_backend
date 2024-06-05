import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsNotEmpty } from 'class-validator';

export class CreateStudioSessionDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  name_track: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  from: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  until: number;

  @ApiProperty()
  @IsNotEmpty()
  user_admin_id: number;

  @ApiProperty()
  @IsNotEmpty()
  user_client_id: number;
}