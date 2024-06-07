import { UserEnitity } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn, ManyToOne, Column, Entity } from 'typeorm';

@Entity('device_token')
export class FcmNotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEnitity, (user) => user.device_token)
  user: UserEnitity;

  @Column()
  device_token: string;
}