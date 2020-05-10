import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  password: string;
}
