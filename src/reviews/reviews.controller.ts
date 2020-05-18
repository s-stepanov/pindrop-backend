import {
  Controller,
  Get,
  Query,
  Post,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto, ReviewDto } from './models/review.dto';
import { ApiQuery } from '@nestjs/swagger';

@ApiTags('reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

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
  public async getReviews(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('mbid') mbid: string,
    @Query('authorId') authorId: number,
  ): Promise<ReviewDto[]> {
    return this.reviewsService.getReviews(page, limit, mbid, authorId);
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
  public async createReview(
    @Body() reviewDto: CreateReviewDto,
  ): Promise<ReviewDto> {
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
}
