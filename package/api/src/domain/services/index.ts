import { v4 as uuidv4 } from 'uuid';
import { Review, ReviewStatus } from '../entities/Review';
import { Comment } from '../entities/Comment';
import { ReviewRepository, CommentRepository, ReviewService, CommentService } from '../interfaces';
import { NotFoundError, ValidationError } from '../errors';

export class ReviewServiceImpl implements ReviewService {
  constructor(private reviewRepository: ReviewRepository) {}

  async getReviews(page: number = 1, limit: number = 10): Promise<{ reviews: Review[]; total: number }> {
    return await this.reviewRepository.findAll(page, limit);
  }

  async getReviewById(id: string): Promise<Review | null> {
    return await this.reviewRepository.findById(id);
  }

  async createReview(title: string, description: string, reviewer?: string): Promise<Review> {
    if (!title.trim()) {
      throw new ValidationError('Title is required');
    }
    if (!description.trim()) {
      throw new ValidationError('Description is required');
    }

    const review = new Review(
      this.generateId(),
      title.trim(),
      description.trim(),
      ReviewStatus.PENDING,
      reviewer?.trim()
    );
    return await this.reviewRepository.create(review);
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview) {
      throw new NotFoundError('Review', id);
    }

    // Validate updates
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new ValidationError('Title cannot be empty');
    }
    if (updates.description !== undefined && !updates.description.trim()) {
      throw new ValidationError('Description cannot be empty');
    }

    const updatedReview = {
      ...existingReview,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return await this.reviewRepository.update(id, updatedReview);
  }

  async deleteReview(id: string): Promise<boolean> {
    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview) {
      throw new NotFoundError('Review', id);
    }
    return await this.reviewRepository.delete(id);
  }

  async updateReviewStatus(id: string, status: ReviewStatus): Promise<Review | null> {
    return await this.updateReview(id, { status });
  }

  private generateId(): string {
    return uuidv4();
  }
}

export class CommentServiceImpl implements CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async getCommentsByReviewId(reviewId: string): Promise<Comment[]> {
    return await this.commentRepository.findByReviewId(reviewId);
  }

  async createComment(reviewId: string, content: string, author: string): Promise<Comment> {
    if (!content.trim()) {
      throw new ValidationError('Content is required');
    }
    if (!author.trim()) {
      throw new ValidationError('Author is required');
    }

    const comment = new Comment(
      this.generateId(),
      reviewId,
      content.trim(),
      author.trim()
    );
    return await this.commentRepository.create(comment);
  }

  async deleteComment(id: string): Promise<boolean> {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundError('Comment', id);
    }
    return await this.commentRepository.delete(id);
  }

  private generateId(): string {
    return uuidv4();
  }
}
