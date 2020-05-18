import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto, ReviewDto } from './models/review.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async getReviews(
    page: number,
    limit: number,
    mbid?: string,
    authorId?: number,
  ): Promise<ReviewDto[]> {
    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.author', 'user')
      .orderBy('review.createdDate', 'DESC')
      .skip(page * limit)
      .take(limit);

    if (mbid) {
      query.andWhere('review.releaseMbid = :mbid', { mbid });
    }
    if (authorId) {
      query.andWhere('user.id = :authorId', { authorId });
    }

    return query.getMany();
  }

  public async getReviewById(id: number): Promise<ReviewDto> {
    return this.reviewsRepository.findOne(id, {
      relations: ['author'],
    });
  }

  public async createReview(reviewDto: CreateReviewDto): Promise<ReviewDto> {
    const author: User = await this.usersRepository.findOneOrFail(
      reviewDto.userId,
    );

    const review: Review = this.reviewsRepository.create(reviewDto);
    review.author = author;
    return this.reviewsRepository.save(review);
  }

  public async deleteReview(id: number) {
    const reviewToDelete = await this.reviewsRepository.findOneOrFail(id);
    return this.reviewsRepository.remove(reviewToDelete);
  }
}
