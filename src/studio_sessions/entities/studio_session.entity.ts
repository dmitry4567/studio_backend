import { UserEnitity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('studio_sessions')
@Unique(['from', 'until'])
export class StudioSessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({nullable: true})
  name_track: string;

  @Column()
  from: Date;

  @Column()
  until: Date;

  @ManyToMany(() => UserEnitity, user => user.admin_sessions)
  @JoinTable()
  user_admins: UserEnitity[];

  @ManyToMany(() => UserEnitity, user => user.client_sessions)
  @JoinTable()
  user_clients: UserEnitity[];

  @CreateDateColumn()
  created_at: Date;
}
