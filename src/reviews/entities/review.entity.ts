import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ReleaseMetadata } from './review-release-metadata.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  releaseScore: number;

  @Column({
    default: 0,
  })
  rating: number;

  @ManyToOne(_ => User)
  author: User;

  @ManyToOne(_ => ReleaseMetadata)
  releaseMetadata: ReleaseMetadata;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
