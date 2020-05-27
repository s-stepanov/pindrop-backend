import {
  Controller,
  Get,
  Query,
  Post,
  Delete,
  Param,
  Body,
  BadRequestException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto, ReviewDto } from './models/review.dto';
import { ApiQuery } from '@nestjs/swagger';
import { ReviewActions } from './enums/review-actions.enum';
import { VotingService } from './voting.service';
import { LoggedInUser } from 'src/shared/decorators/logged-in-user.decorator';
import { VoteExistsError } from './errors/vote-exists.error';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService, private readonly votingService: VotingService) {}

  /**
   * Returns pageable most recent reviews
   */
  @Get()
  @ApiQuery({
    name: 'mbid',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
  })
  public async getReviews(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('mbid') mbid: string,
    @Query('authorId') authorId: number,
    @Query('sort') sort: string,
    @LoggedInUser() user,
  ): Promise<ReviewDto[]> {
    return this.reviewsService.getReviews(page, limit, mbid, authorId, sort, user.id);
  }

  @Get(':id')
  public async getReviewById(@Param('id') id: number): Promise<ReviewDto> {
    return this.reviewsService.getReviewById(id);
  }

  /**
   * Creates new rewiew
   * @param reviewDto - request body
   */
  @Post()
  public async createReview(@Body() reviewDto: CreateReviewDto): Promise<ReviewDto> {
    try {
      const created = await this.reviewsService.createReview(reviewDto);
      return created;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  /**
   * Deletes a review
   * @param id - id of the review to delete
   */
  @Delete(':id')
  public async deleteReview(@Param('id') id: number): Promise<ReviewDto> {
    return this.reviewsService.deleteReview(id);
  }

  @Patch(':id')
  public async voteForReview(
    @Param('id') id: number,
    @Query('action') action: ReviewActions,
    @LoggedInUser() user,
  ): Promise<ReviewDto> {
    try {
      if (!Object.values(ReviewActions).includes(action)) {
        throw new BadRequestException('unknown action');
      }

      const votedReview = await this.votingService.voteForReview(id, user.id, action);
      return votedReview;
    } catch (e) {
      if (e instanceof VoteExistsError) {
        throw new BadRequestException(e);
      }
      throw e;
    }
  }
}
