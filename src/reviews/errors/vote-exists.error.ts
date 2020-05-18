import { ReviewActions } from '../enums/review-actions.enum';

export class VoteExistsError extends Error {
  constructor(type: ReviewActions) {
    super(
      `You have already ${
        type === ReviewActions.DOWNVOTE ? 'downvoted' : 'upvoted'
      } on this review`,
    );
  }
}
