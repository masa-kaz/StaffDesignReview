import { Review, ReviewStatus } from '../entities/Review';
import { Comment } from '../entities/Comment';

export interface ReviewRepository {
  findAll(page?: number, limit?: number): Promise<{ reviews: Review[]; total: number }>;
  findById(id: string): Promise<Review | null>;
  create(review: Review): Promise<Review>;
  update(id: string, review: Partial<Review>): Promise<Review | null>;
  delete(id: string): Promise<boolean>;
}

export interface CommentRepository {
  findByReviewId(reviewId: string): Promise<Comment[]>;
  findById(id: string): Promise<Comment | null>;
  create(comment: Comment): Promise<Comment>;
  delete(id: string): Promise<boolean>;
}

export interface ReviewService {
  getReviews(page?: number, limit?: number): Promise<{ reviews: Review[]; total: number }>;
  getReviewById(id: string): Promise<Review | null>;
  createReview(title: string, description: string, reviewer?: string): Promise<Review>;
  updateReview(id: string, updates: Partial<Review>): Promise<Review | null>;
  deleteReview(id: string): Promise<boolean>;
  updateReviewStatus(id: string, status: ReviewStatus): Promise<Review | null>;
}

export interface CommentService {
  getCommentsByReviewId(reviewId: string): Promise<Comment[]>;
  createComment(reviewId: string, content: string, author: string): Promise<Comment>;
  deleteComment(id: string): Promise<boolean>;
}
