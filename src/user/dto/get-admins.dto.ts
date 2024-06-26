import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class GetAdminsDto {
  @ApiProperty()
  @IsString()
  token: string;
}
