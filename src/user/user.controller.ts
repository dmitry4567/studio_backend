import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { GetAdminsDto } from './dto/get-admins.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // async getAllUsers() {
  //   return this.userService.getAllUsers();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // delete(@Request() req: any): Promise<DeleteResult> {
  //   return this.userService.remove(req);
  // }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('info')
  async getUser(@Request() req: any) {
    return this.userService.getUser(req.user.id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('admins')
  async getAdmins(@Body() dto: GetAdminsDto) {
    return this.userService.getAdmins();
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('updateRoleUser')
  async updateRoleUser(@Body() dto: UpdateRoleUserDto) {
    return this.userService.updateRoleUser(dto);
  }
}
