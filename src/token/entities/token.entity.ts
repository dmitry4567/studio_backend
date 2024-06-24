import { UserEnitity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEnitity, (user) => user.token)
  user: UserEnitity;

  @Column()
  refresh_token: string;
}
