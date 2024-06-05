import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudioSessionDto } from './dto/create-studio_session.dto';
import { StudioSessionEntity } from './entities/studio_session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { TypeOfActivityService } from 'src/type_of_activity/type_of_activity.service';

@Injectable()
export class StudioSessionsService {
  constructor(
    @InjectRepository(StudioSessionEntity)
    private studioSessionRepository: Repository<StudioSessionEntity>,
    private readonly userService: UserService,
    private readonly typeOfActivityService: TypeOfActivityService,
  ) {}

  async create(dto: CreateStudioSessionDto) {
    try {
      if (dto.from >= dto.until) {
        throw new HttpException(
          'Длительность сессии должна быть больше нуля',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isOccupied = await this.isTimeOccupied(dto.from, dto.until);

      if (isOccupied) {
        throw new HttpException('Время занято', HttpStatus.CONFLICT);
      }

      const user_admins = await this.userService.findRolesByIds(
        dto.user_admins_id,
        'admin',
      );
      const user_clients = await this.userService.findRolesByIds(
        dto.user_clients_id,
        'user',
      );

      if (!user_admins.length || !user_clients.length) {
        throw new Error('User not found');
      }

      const studio_session = new StudioSessionEntity();

      const type_of_activity = await this.typeOfActivityService.findOne(
        dto.type_of_activity_id,
      );
      if (!type_of_activity) {
        throw new HttpException('Тип не найден', HttpStatus.NOT_FOUND);
      }
      studio_session.type_of_activity = type_of_activity;

      if (dto.name_track != '') {
        studio_session.name_track = dto.name_track;
      }
      studio_session.from = new Date(dto.from * 1000);
      studio_session.until = new Date(dto.until * 1000);

      studio_session.user_admins = user_admins;
      studio_session.user_clients = user_clients;

      const data = await this.studioSessionRepository.save(studio_session);

      return data;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('Это время занято', HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  private async isTimeOccupied(
    fromUnix: number,
    untilUnix: number,
  ): Promise<boolean> {
    const fromTimestamp = new Date(fromUnix * 1000);
    const untilTimestamp = new Date(untilUnix * 1000);

    const overlappingSessions = await this.studioSessionRepository
      .createQueryBuilder('studio_session')
      .where('studio_session.from < :until AND studio_session.until > :from', {
        from: fromTimestamp,
        until: untilTimestamp,
      })
      .getCount();

    return overlappingSessions > 0;
  }

  async findAll() {
    const sessions = await this.studioSessionRepository
      .createQueryBuilder('studio_session')
      .leftJoinAndSelect('studio_session.type_of_activity', 'type_of_activity')
      .leftJoinAndSelect('studio_session.user_admins', 'user_admins')
      .leftJoinAndSelect('studio_session.user_clients', 'user_clients')
      .select([
        'studio_session.id',
        'type_of_activity.name',
        'studio_session.name_track',
        'studio_session.from',
        'studio_session.until',
        'user_admins.id',
        'user_admins.nickname',
        'user_clients.id',
        'user_clients.nickname',
      ])
      .getMany();

    return sessions;
  }
}
