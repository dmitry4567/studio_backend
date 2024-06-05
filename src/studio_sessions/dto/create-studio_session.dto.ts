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

  @ApiProperty({ type: 'array' })
  @IsNotEmpty()
  user_admins_id: number[];

  @ApiProperty({ type: 'array' })
  @IsNotEmpty()
  user_clients_id: number[];
}
