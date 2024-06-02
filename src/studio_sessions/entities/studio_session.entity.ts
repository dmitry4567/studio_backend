import { UserEnitity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('studio_sessions')
export class StudioSessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  from: Date;

  @Column({ type: 'timestamp' })
  until: Date;

  @ManyToOne(() => UserEnitity, (user) => user.studio_session_admins, {
    eager: true,
  })
  @JoinColumn({ name: 'user_admin_id' })
  user_admin: UserEnitity;

  @ManyToOne(() => UserEnitity, (user) => user.studio_session_clients, {
    eager: true,
  })
  @JoinColumn({ name: 'user_client_id' })
  user_client: UserEnitity;

  @CreateDateColumn()
  created_at: Date;
}
