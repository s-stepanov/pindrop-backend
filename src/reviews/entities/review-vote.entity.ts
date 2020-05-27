import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Review } from './review.entity';

@Entity('review_votes')
@Unique(['user', 'review'])
export class ReviewVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0,
  })
  action: number;

  @ManyToOne(_ => User)
  user: User;

  @ManyToOne(_ => Review)
  review: Review;
}
