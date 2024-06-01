import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const existingRole = await this.roleRepository.findOneBy({
      value: dto.value,
    });

    if (existingRole)
      throw new BadRequestException('This role value already exists');

    const role = this.roleRepository.save({
      value: dto.value,
      description: dto.description,
    });

    return role;
  }

  async getRoleById(id: number) {
    return this.roleRepository.findOneBy({
      id,
    });
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.findOneBy({
      value: value,
    });
  }
}
