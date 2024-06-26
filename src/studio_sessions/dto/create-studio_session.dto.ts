import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateStudioSessionDto {
  @ApiProperty()
  @IsString()
  token: number;

  @ApiProperty()
  @IsNotEmpty()
  type_of_activity_id: number;

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

  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @ArrayMinSize(1)
  @IsNotEmpty()
  user_admins_id: number[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
  })
  user_clients_id: number[];
}
