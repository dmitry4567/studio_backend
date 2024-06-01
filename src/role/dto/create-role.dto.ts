import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  value: string;

  @ApiProperty({ example: 'Administrator' })
  description: string;
}
