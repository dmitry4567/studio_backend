import { FcmNotificationEntity } from 'src/fcm-notification/entities/fcm-notification.entity';
import { Role } from 'src/role/entities/role.entity';
import { StudioSessionEntity } from 'src/studio_sessions/entities/studio_session.entity';
import { TokenEntity } from 'src/token/entities/token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
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

  @ManyToMany(
    () => StudioSessionEntity,
    (studioSession) => studioSession.user_admins,
  )
  admin_sessions: StudioSessionEntity[];

  @ManyToMany(
    () => StudioSessionEntity,
    (studioSession) => studioSession.user_clients,
  )
  client_sessions: StudioSessionEntity[];

  @OneToMany(() => TokenEntity, (token) => token.user)
  token: TokenEntity;

  @OneToMany(() => FcmNotificationEntity, (token) => token.device_token)
  device_token: FcmNotificationEntity;

  @CreateDateColumn()
  createAt: Date;
}
