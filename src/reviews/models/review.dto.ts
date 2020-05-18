import { UserDto } from 'src/user/models/user.dto';
import { IsNotEmpty } from 'class-validator';

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
  releaseMbid: string;
  author: UserDto;
  releaseScore: number;
  id: number;
}
