import { ApiHideProperty } from '@nestjs/swagger';
import { Role } from 'src/role/entities/role.entity';
import { StudioSessionEntity } from 'src/studio_sessions/entities/studio_session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEnitity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
