import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { VotingService } from './voting.service';
import { ReviewVote } from './entities/review-vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewVote, User]), UserModule],
  providers: [ReviewsService, VotingService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
