import { UserDto } from 'src/user/models/user.dto';
import { IsNotEmpty } from 'class-validator';
import { ReleaseMetadata } from '../entities/review-release-metadata.entity';

export class CreateReviewDto {
  content: string;

  @IsNotEmpty()
  releaseMbid: string;

  @IsNotEmpty()
  userId: number;

  releaseScore: number;
}

export class ReviewDto {
  content: string;
  releaseMetadata: ReleaseMetadata;
  author: UserDto;
  releaseScore: number;
  rating: number;
  id: number;
  canUpvote?: boolean;
  canDownvote?: boolean;
}
