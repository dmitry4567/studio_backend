import { ApiHideProperty } from '@nestjs/swagger';
import { Role } from 'src/role/entities/role.entity';
import { StudioSessionEntity } from 'src/studio_sessions/entities/studio_session.entity';
import { TokenEntity } from 'src/token/entities/token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEnitity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;

  @ApiHideProperty()
  @OneToMany(
    () => StudioSessionEntity,
    (studio_session) => studio_session.user_admin,
  )
  studio_session_admins: StudioSessionEntity[];

  @ApiHideProperty()
  @OneToMany(
    () => StudioSessionEntity,
    (studio_session) => studio_session.user_client,
  )
  studio_session_clients: StudioSessionEntity[];
  
  @OneToMany(() => TokenEntity, (token) => token.user)
  token: TokenEntity;

  @CreateDateColumn()
  createAt: Date;
}
