import { Controller, Get, Post, Body } from '@nestjs/common';
import { StudioSessionsService } from './studio_sessions.service';
import { CreateStudioSessionDto } from './dto/create-studio_session.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('studio-sessions')
@Controller('studio-sessions')
export class StudioSessionsController {
  constructor(private readonly studioSessionsService: StudioSessionsService) {}

  @Post('create')
  async create(@Body() dto: CreateStudioSessionDto) {
    return this.studioSessionsService.create(dto);
  }

  @Get('all')
  async findAll() {
    return this.studioSessionsService.findAll();
  }
}
