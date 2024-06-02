import { Injectable } from '@nestjs/common';
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
      const user_admin = await this.userService.findById(dto.user_admin_id);
      const user_client = await this.userService.findById(dto.user_client_id);

      if (!user_admin || !user_client) {
        throw new Error('User not found');
      }

      const studio_session = new StudioSessionEntity();

      studio_session.from = dto.from;
      studio_session.until = dto.until;
      studio_session.user_admin = user_admin;
      studio_session.user_client = user_client;

      const data = await this.studioSessionRepository.save(studio_session);
      console.log(data);

      return data;
    } catch (error) {
      console.error('Error creating studio session:', error);
      throw error;
    }
  }

  async findAll() {
    const sessions = await this.studioSessionRepository
      .createQueryBuilder('studio_session')
      .leftJoinAndSelect('studio_session.user_admin', 'user_admin')
      .leftJoinAndSelect('studio_session.user_client', 'user_client')
      .select([
        'studio_session.id',
        'studio_session.from',
        'studio_session.until',
        'user_admin.id',
        'user_client.id',
      ])
      .getMany();

    return sessions;
  }
}
