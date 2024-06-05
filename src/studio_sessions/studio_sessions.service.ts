import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudioSessionDto } from './dto/create-studio_session.dto';
import { StudioSessionEntity } from './entities/studio_session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StudioSessionsService {
  constructor(
    @InjectRepository(StudioSessionEntity)
    private studioSessionRepository: Repository<StudioSessionEntity>,
    private readonly userService: UserService,
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
        throw new HttpException('Это время занято', HttpStatus.CONFLICT);
      }

      const user_admin = await this.userService.findById(dto.user_admin_id);
      const user_client = await this.userService.findById(dto.user_client_id);

      if (!user_admin || !user_client) {
        throw new Error('User not found');
      }

      const studio_session = new StudioSessionEntity();

      studio_session.title = dto.title;
      if (dto.name_track != '') {
        studio_session.name_track = dto.name_track;
      }
      studio_session.from = new Date(dto.from * 1000);
      studio_session.until = new Date(dto.until * 1000);
      studio_session.user_admin = user_admin;
      studio_session.user_client = user_client;

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
      .leftJoinAndSelect('studio_session.user_admin', 'user_admin')
      .leftJoinAndSelect('studio_session.user_client', 'user_client')
      .select([
        'studio_session.id',
        'studio_session.title',
        'studio_session.name_track',
        'studio_session.from',
        'studio_session.until',
        'user_admin.id',
        'user_admin.nickname',
        'user_client.id',
        'user_client.nickname',
      ])
      .getMany();

    return sessions;
  }
}
