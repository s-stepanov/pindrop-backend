import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto, ReviewDto } from './models/review.dto';
import { User } from 'src/user/entities/user.entity';
import { ReleaseMetadata } from './entities/review-release-metadata.entity';
import { Album } from 'src/search/models/album';
import { SearchService } from 'src/search/search.service';
import { ReviewVote } from './entities/review-vote.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ReleaseMetadata)
    private readonly releaseMetadataRepository: Repository<ReleaseMetadata>,
    @InjectRepository(ReviewVote)
    private readonly votesRepository: Repository<ReviewVote>,
    private readonly searchService: SearchService,
  ) {}

  public async getReviews(
    page: number,
    limit: number,
    mbid?: string,
    authorId?: number,
    sort?: string,
    userId?: number,
  ): Promise<ReviewDto[]> {
    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.author', 'user')
      .leftJoinAndSelect('review.releaseMetadata', 'releaseMetadata')
      .skip(page * limit)
      .take(limit);

    if (mbid) {
      query.andWhere('releaseMetadata.mbid = :mbid', { mbid });
    }
    if (authorId) {
      query.andWhere('user.id = :authorId', { authorId });
    }
    if (sort === 'rating') {
      query.orderBy('review.rating', 'DESC');
    } else {
      query.orderBy('review.createdDate', 'DESC');
    }

    const res = await query.getMany();

    const reviews: ReviewDto[] = await Promise.all(
      res.map(async review => {
        const vote = await this.votesRepository
          .createQueryBuilder('vote')
          .leftJoinAndSelect('vote.user', 'user')
          .leftJoinAndSelect('vote.review', 'review')
          .andWhere('user.id = :userId', { userId })
          .andWhere('review.id = :reviewId', { reviewId: review.id })
          .getOne();

        return {
          ...review,
          canUpvote: vote?.action !== 1,
          canDownvote: vote?.action !== -1,
        };
      }),
    );

    return reviews;
  }

  public async getReviewById(id: number): Promise<ReviewDto> {
    return this.reviewsRepository.findOne(id, {
      relations: ['author', 'releaseMetadata'],
    });
  }

  public async createReview(reviewDto: CreateReviewDto): Promise<ReviewDto> {
    const author: User = await this.usersRepository.findOneOrFail(reviewDto.userId);
    const release: Album = await this.searchService.searchAlbumInfo(reviewDto.releaseMbid).toPromise();

    const releaseMetadata = this.releaseMetadataRepository.create({
      mbid: release.mbid,
      artistName: release.artist,
      albumName: release.name,
      coverArt: release.image[2].url,
    });
    const savedMetadata = await this.releaseMetadataRepository.save(releaseMetadata);

    const review: Review = this.reviewsRepository.create(reviewDto);
    review.author = author;
    review.releaseMetadata = savedMetadata;
    return {
      ...(await this.reviewsRepository.save(review)),
      canUpvote: true,
      canDownvote: true,
    };
  }

  public async deleteReview(id: number) {
    const reviewToDelete = await this.reviewsRepository.findOneOrFail(id);
    return this.reviewsRepository.remove(reviewToDelete);
  }
}
