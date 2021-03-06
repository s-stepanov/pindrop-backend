import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from './user-role.entity';

@Entity({
  name: 'users',
})
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({
    default: false,
  })
  accountActive: boolean;

  @ManyToMany(_ => UserRole)
  @JoinTable()
  userRole: UserRole[];

  @Column({ select: false })
  @Exclude()
  password: string;
}
