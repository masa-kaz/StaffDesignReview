import { Review } from '../../domain/entities/Review';
import { Comment } from '../../domain/entities/Comment';
import { ReviewRepository, CommentRepository } from '../../domain/interfaces';

export class InMemoryReviewRepository implements ReviewRepository {
  private reviews: Review[] = [
    new Review(
      '1',
      'ホームページデザイン',
      '新しいホームページのデザイン案です。',
      'pending' as any,
      '田中太郎'
    ),
    new Review(
      '2',
      'ロゴデザイン',
      '会社の新しいロゴデザイン案です。',
      'approved' as any,
      '佐藤花子'
    )
  ];

  async findAll(page: number = 1, limit: number = 10): Promise<{ reviews: Review[]; total: number }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = this.reviews.slice(startIndex, endIndex);
    
    return {
      reviews: paginatedReviews,
      total: this.reviews.length
    };
  }

  async findById(id: string): Promise<Review | null> {
    return this.reviews.find(review => review.id === id) || null;
  }

  async create(review: Review): Promise<Review> {
    this.reviews.push(review);
    return review;
  }

  async update(id: string, updates: Partial<Review>): Promise<Review | null> {
    const index = this.reviews.findIndex(review => review.id === id);
    if (index === -1) {
      return null;
    }

    this.reviews[index] = { ...this.reviews[index], ...updates };
    return this.reviews[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.reviews.findIndex(review => review.id === id);
    if (index === -1) {
      return false;
    }

    this.reviews.splice(index, 1);
    return true;
  }
}

export class InMemoryCommentRepository implements CommentRepository {
  private comments: Comment[] = [
    new Comment(
      '1',
      '1',
      '色合いをもう少し明るくした方が良いと思います。',
      'レビュアー1'
    ),
    new Comment(
      '2',
      '1',
      'レイアウトは良いと思いますが、フォントサイズを調整してください。',
      'レビュアー2'
    )
  ];

  async findByReviewId(reviewId: string): Promise<Comment[]> {
    return this.comments.filter(comment => comment.reviewId === reviewId);
  }

  async findById(id: string): Promise<Comment | null> {
    return this.comments.find(comment => comment.id === id) || null;
  }

  async create(comment: Comment): Promise<Comment> {
    this.comments.push(comment);
    return comment;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index === -1) {
      return false;
    }

    this.comments.splice(index, 1);
    return true;
  }
}
