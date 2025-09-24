import { Review, ReviewStatus } from '../entities/Review';
import { Comment } from '../entities/Comment';
import { ReviewService, CommentService } from '../interfaces';

// Use Case Interfaces
export interface IGetReviewsUseCase {
  execute(page?: number, limit?: number): Promise<{ reviews: Review[]; total: number }>;
}

export interface IGetReviewByIdUseCase {
  execute(id: string): Promise<Review | null>;
}

export interface ICreateReviewUseCase {
  execute(title: string, description: string, reviewer?: string): Promise<Review>;
}

export interface IUpdateReviewUseCase {
  execute(id: string, updates: Partial<Review>): Promise<Review | null>;
}

export interface IDeleteReviewUseCase {
  execute(id: string): Promise<boolean>;
}

export interface IGetCommentsByReviewIdUseCase {
  execute(reviewId: string): Promise<Comment[]>;
}

export interface ICreateCommentUseCase {
  execute(reviewId: string, content: string, author: string): Promise<Comment>;
}

export interface IDeleteCommentUseCase {
  execute(id: string): Promise<boolean>;
}

// Use Case Implementations
export class GetReviewsUseCase implements IGetReviewsUseCase {
  constructor(private reviewService: ReviewService) {}

  async execute(page: number = 1, limit: number = 10): Promise<{ reviews: Review[]; total: number }> {
    return await this.reviewService.getReviews(page, limit);
  }
}

export class GetReviewByIdUseCase implements IGetReviewByIdUseCase {
  constructor(private reviewService: ReviewService) {}

  async execute(id: string): Promise<Review | null> {
    return await this.reviewService.getReviewById(id);
  }
}

export class CreateReviewUseCase implements ICreateReviewUseCase {
  constructor(private reviewService: ReviewService) {}

  async execute(title: string, description: string, reviewer?: string): Promise<Review> {
    return await this.reviewService.createReview(title, description, reviewer);
  }
}

export class UpdateReviewUseCase implements IUpdateReviewUseCase {
  constructor(private reviewService: ReviewService) {}

  async execute(id: string, updates: Partial<Review>): Promise<Review | null> {
    return await this.reviewService.updateReview(id, updates);
  }
}

export class DeleteReviewUseCase implements IDeleteReviewUseCase {
  constructor(private reviewService: ReviewService) {}

  async execute(id: string): Promise<boolean> {
    return await this.reviewService.deleteReview(id);
  }
}

export class GetCommentsByReviewIdUseCase implements IGetCommentsByReviewIdUseCase {
  constructor(private commentService: CommentService) {}

  async execute(reviewId: string): Promise<Comment[]> {
    return await this.commentService.getCommentsByReviewId(reviewId);
  }
}

export class CreateCommentUseCase implements ICreateCommentUseCase {
  constructor(private commentService: CommentService) {}

  async execute(reviewId: string, content: string, author: string): Promise<Comment> {
    return await this.commentService.createComment(reviewId, content, author);
  }
}

export class DeleteCommentUseCase implements IDeleteCommentUseCase {
  constructor(private commentService: CommentService) {}

  async execute(id: string): Promise<boolean> {
    return await this.commentService.deleteComment(id);
  }
}
