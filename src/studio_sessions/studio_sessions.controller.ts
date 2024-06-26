import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StudioSessionsService } from './studio_sessions.service';
import { CreateStudioSessionDto } from './dto/create-studio_session.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ChooseTimeSessionDto } from './dto/choose-time.dto';

@ApiTags('studio-sessions')
@Controller('studio-sessions')
export class StudioSessionsController {
  constructor(private readonly studioSessionsService: StudioSessionsService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create')
  async create(@Body() dto: CreateStudioSessionDto) {
    return this.studioSessionsService.create(dto);
  }

  @Get('all')
  async findAll() {
    return this.studioSessionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("token")
  @Post('findByTimePeriod')
  async findByTimePeriod(@Body() dto: ChooseTimeSessionDto) {
    return this.studioSessionsService.findByTimePeriod(dto);
  }
}
