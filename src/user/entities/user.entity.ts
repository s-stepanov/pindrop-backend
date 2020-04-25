import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

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
  password: string;
}
