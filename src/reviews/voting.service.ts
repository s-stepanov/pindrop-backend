import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository, getConnection, EntityManager } from 'typeorm';
import { ReviewVote } from './entities/review-vote.entity';
import { User } from 'src/user/entities/user.entity';
import { ReviewActions } from './enums/review-actions.enum';
import { VoteExistsError } from './errors/vote-exists.error';
import { ReviewDto } from './models/review.dto';

export const voteActionsMap = {
  upvote: 1,
  downvote: -1,
};

@Injectable()
export class VotingService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewVote) private readonly votesRepository: Repository<ReviewVote>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async voteForReview(reviewId: number, userId: number, action: ReviewActions): Promise<ReviewDto> {
    let vote: ReviewVote = await this.getVote(userId, reviewId);
    if (Math.abs(vote?.action + voteActionsMap[action]) > 1) {
      throw new VoteExistsError(action);
    }

    if (!vote) {
      vote = this.votesRepository.create();
    }

    const reviewToVote: Review = await this.reviewsRepository.findOneOrFail(reviewId);
    const votingUser: User = await this.usersRepository.findOneOrFail(userId);

    vote.review = reviewToVote;
    vote.user = votingUser;

    vote.action = vote.action !== undefined ? vote.action + voteActionsMap[action] : 0;

    action === ReviewActions.UPVOTE ? reviewToVote.rating++ : reviewToVote.rating--;

    await getConnection().transaction(async (em: EntityManager) => {
      await em.save(reviewToVote);
      await em.save(vote);
    });

    return Promise.resolve({
      ...reviewToVote,
      canDownvote: vote.action !== -1,
      canUpvote: vote.action !== 1,
    });
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
