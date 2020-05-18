import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository, getConnection, EntityManager } from 'typeorm';
import { ReviewVote } from './entities/review-vote.entity';
import { User } from 'src/user/entities/user.entity';
import { ReviewActions } from './enums/review-actions.enum';
import { VoteExistsError } from './errors/vote-exists.error';

@Injectable()
export class VotingService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewVote) private readonly votesRepository: Repository<ReviewVote>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async voteForReview(reviewId: number, userId: number, action: ReviewActions): Promise<Review> {
    let vote: ReviewVote = await this.getVote(userId, reviewId);
    if (vote?.action === action) {
      throw new VoteExistsError(action);
    }
    if (!vote) {
      vote = this.votesRepository.create();
    }

    const reviewToVote: Review = await this.reviewsRepository.findOneOrFail(reviewId);
    const votingUser: User = await this.usersRepository.findOneOrFail(userId);

    vote.review = reviewToVote;
    vote.user = votingUser;
    vote.action = action;

    action === ReviewActions.UPVOTE ? reviewToVote.rating++ : reviewToVote.rating--;

    await getConnection().transaction(async (em: EntityManager) => {
      await em.save(reviewToVote);
      await em.save(vote);
    });

    return Promise.resolve(reviewToVote);
  }

  public async getVote(userId: number, reviewId: number): Promise<ReviewVote> {
    const vote = await this.votesRepository
      .createQueryBuilder('vote')
      .andWhere('vote.user.id = :userId', { userId })
      .andWhere('vote.review.id = :reviewId', { reviewId })
      .getOne();

    return Promise.resolve(vote);
  }
}
