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

  @Column()
  accountActive: boolean = false;

  @ManyToMany(_ => UserRole)
  @JoinTable()
  userRole: UserRole[];

  @Column()
  @Exclude()
  password: string;
}
