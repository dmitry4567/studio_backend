import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TypeOfActivityService } from './type_of_activity.service';
import { CreateTypeOfActivityDto } from './dto/create-type_of_activity.dto';
import { UpdateTypeOfActivityDto } from './dto/update-type_of_activity.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@ApiTags('type-of-activity')
@Controller('type-of-activity')
export class TypeOfActivityController {
  constructor(private readonly typeOfActivityService: TypeOfActivityService) {}

 
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('add')
  create(@Body() createFeatureDto: CreateTypeOfActivityDto) {
    return this.typeOfActivityService.create(createFeatureDto);
  }

  @Get('all')
  findAll() {
    return this.typeOfActivityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeOfActivityService.findOne(+id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeatureDto: UpdateTypeOfActivityDto) {
    return this.typeOfActivityService.update(+id, updateFeatureDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeOfActivityService.remove(+id);
  }
}
