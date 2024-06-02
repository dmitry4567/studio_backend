import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudioSessionsService } from './studio_sessions.service';
import { CreateStudioSessionDto } from './dto/create-studio_session.dto';

@Controller('studio-sessions')
export class StudioSessionsController {
  constructor(private readonly studioSessionsService: StudioSessionsService) {}

  @Post()
  async create(@Body() dto: CreateStudioSessionDto) {
    return this.studioSessionsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.studioSessionsService.findAll();
  }
}
