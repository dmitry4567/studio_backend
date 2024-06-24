import { UserEnitity } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn, ManyToOne, Column, Entity, OneToOne } from 'typeorm';

@Entity('device_token')
export class FcmNotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEnitity, (user) => user.device_token)
  user: UserEnitity;

  @Column()
  device_token: string;
}
