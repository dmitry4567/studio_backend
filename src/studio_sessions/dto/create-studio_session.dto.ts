import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsISO8601, IsInt, IsNotEmpty } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateStudioSessionDto {
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
  @ArrayMinSize(1)
  @IsNotEmpty()
  user_clients_id: number[];
}
