import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEnitity } from './entities/user.entity';
import { RoleService } from 'src/role/role.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly hashSaltRounds: number;

  constructor(
    @InjectRepository(UserEnitity)
    private readonly userRepository: Repository<UserEnitity>,
    private readonly roleService: RoleService,
  ) {
    this.hashSaltRounds = parseInt(process.env.HASH_SALT_ROUNDS);
  }

  async create(dto: CreateUserDto): Promise<UserEnitity> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        `Пользователь с email: ${dto.email} уже существует`,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.hashSaltRounds);

    const user = await this.userRepository.save({
      email: dto.email,
      password: hashedPassword,
    });

    const role = await this.roleService.getRoleByValue('user');
    user.role = role;

    await this.userRepository.save(user);

    return user;
  }

  async findOrCreate(user: any) {
    const existingUser = await this.userRepository.findOneBy({
      email: user.googleId,
    });

    if (existingUser) {
      return existingUser;
    }

    await this.userRepository.save({
      email: user.email,
      password: "google"
    });

    return user;
  }

  async findByEmail(email: string): Promise<UserEnitity> {
    const user = await this.userRepository.findOne({
      relations: {
        role: true,
      },
      where: {
        email: email,
      },
    });

    return user;
  }

  async getUser(user) {
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'role',
        'studio_session_admins',
        'studio_session_clients',
      ],
    });
  }

  async getAllUsers() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.studio_session_admins', 'studio_session_admins')
      .leftJoinAndSelect(
        'user.studio_session_clients',
        'studio_session_clients',
      )
      .select([
        'user.id',
        'user.email',
        'user.createAt',
        'user.updateAt',
        'studio_session_admins.id',
        'studio_session_clients.id',
      ])
      .getMany();

    return users.map((user) => ({
      ...user,
      studio_session_admins: user.studio_session_admins.map((admin) => ({
        id: admin.id,
      })),
      studio_session_clients: user.studio_session_clients.map((client) => ({
        id: client.id,
      })),
    }));
  }

  async remove(req: any): Promise<DeleteResult> {
    return await this.userRepository.delete(req.user.id);
  }
}
