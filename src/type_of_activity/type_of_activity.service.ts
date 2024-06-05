import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTypeOfActivityDto } from './dto/create-type_of_activity.dto';
import { UpdateTypeOfActivityDto } from './dto/update-type_of_activity.dto';
import { TypeOfActivityEntity } from './entities/type_of_activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOfActivityService {
  constructor(
    @InjectRepository(TypeOfActivityEntity)
    private typeOfActivityEntity: Repository<TypeOfActivityEntity>,
  ) {}

  async create(dto: CreateTypeOfActivityDto) {
    return this.typeOfActivityEntity.save(dto);
  }

  async findAll() {
    return this.typeOfActivityEntity.find();
  }

  async findOne(id: number) {
    return this.typeOfActivityEntity.findOneBy({ id });
  }

  async update(id: number, dto: UpdateTypeOfActivityDto) {
    const toUpdate = await this.typeOfActivityEntity.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Запись с id=${id} не найдена`);
    }
    if (dto.name) {
      toUpdate.name = dto.name;
    }
    return this.typeOfActivityEntity.save(toUpdate);
  }

  async remove(id: number) {
    return this.typeOfActivityEntity.delete(id);
  }
}
