import { Role } from 'src/role/entities/role.entity';
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
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;

  @OneToMany(() => TokenEntity, (token) => token.user)
  token: TokenEntity;

  @CreateDateColumn()
  createAt: Date;
}
