import { TypeOfActivityEntity } from 'src/type_of_activity/entities/type_of_activity.entity';
import { UserEnitity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('studio_sessions')
@Unique(['from', 'until'])
export class StudioSessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => TypeOfActivityEntity,
    (type_of_activity) => type_of_activity.studio_session,
    {
      eager: true,
    },
  )
  @JoinColumn()
  type_of_activity: TypeOfActivityEntity;

  @Column({ nullable: true })
  name_track: string;

  @Column()
  from: Date;

  @Column()
  until: Date;

  @ManyToMany(() => UserEnitity, (user) => user.admin_sessions)
  @JoinTable()
  user_admins: UserEnitity[];

  @ManyToMany(() => UserEnitity, (user) => user.client_sessions, {
    nullable: true,
  })
  @JoinTable()
  user_clients: UserEnitity[];

  @CreateDateColumn()
  created_at: Date;
}
