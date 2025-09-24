import { ReviewRepository, CommentRepository, ReviewService, CommentService } from '../../domain/interfaces';
import { ReviewServiceImpl, CommentServiceImpl } from '../../domain/services';
import { InMemoryReviewRepository, InMemoryCommentRepository } from '../repositories/InMemoryRepository';
import {
  IGetReviewsUseCase,
  IGetReviewByIdUseCase,
  ICreateReviewUseCase,
  IUpdateReviewUseCase,
  IDeleteReviewUseCase,
  IGetCommentsByReviewIdUseCase,
  ICreateCommentUseCase,
  IDeleteCommentUseCase,
  GetReviewsUseCase,
  GetReviewByIdUseCase,
  CreateReviewUseCase,
  UpdateReviewUseCase,
  DeleteReviewUseCase,
  GetCommentsByReviewIdUseCase,
  CreateCommentUseCase,
  DeleteCommentUseCase
} from '../../domain/usecases';

// Service Container Interface
export interface IServiceContainer {
  getReviewService(): ReviewService;
  getCommentService(): CommentService;
  getReviewRepository(): ReviewRepository;
  getCommentRepository(): CommentRepository;
  
  // Use Cases
  getGetReviewsUseCase(): IGetReviewsUseCase;
  getGetReviewByIdUseCase(): IGetReviewByIdUseCase;
  getCreateReviewUseCase(): ICreateReviewUseCase;
  getUpdateReviewUseCase(): IUpdateReviewUseCase;
  getDeleteReviewUseCase(): IDeleteReviewUseCase;
  getGetCommentsByReviewIdUseCase(): IGetCommentsByReviewIdUseCase;
  getCreateCommentUseCase(): ICreateCommentUseCase;
  getDeleteCommentUseCase(): IDeleteCommentUseCase;
}

// Service Container Implementation
export class ServiceContainer implements IServiceContainer {
  private _reviewRepository?: ReviewRepository;
  private _commentRepository?: CommentRepository;
  private _reviewService?: ReviewService;
  private _commentService?: CommentService;
  
  // Use Cases
  private _getReviewsUseCase?: IGetReviewsUseCase;
  private _getReviewByIdUseCase?: IGetReviewByIdUseCase;
  private _createReviewUseCase?: ICreateReviewUseCase;
  private _updateReviewUseCase?: IUpdateReviewUseCase;
  private _deleteReviewUseCase?: IDeleteReviewUseCase;
  private _getCommentsByReviewIdUseCase?: IGetCommentsByReviewIdUseCase;
  private _createCommentUseCase?: ICreateCommentUseCase;
  private _deleteCommentUseCase?: IDeleteCommentUseCase;

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
    // Initialize repositories
    this._reviewRepository = new InMemoryReviewRepository();
    this._commentRepository = new InMemoryCommentRepository();

    // Initialize services with dependency injection
    this._reviewService = new ReviewServiceImpl(this._reviewRepository);
    this._commentService = new CommentServiceImpl(this._commentRepository);
    
    // Initialize use cases
    this._getReviewsUseCase = new GetReviewsUseCase(this._reviewService);
    this._getReviewByIdUseCase = new GetReviewByIdUseCase(this._reviewService);
    this._createReviewUseCase = new CreateReviewUseCase(this._reviewService);
    this._updateReviewUseCase = new UpdateReviewUseCase(this._reviewService);
    this._deleteReviewUseCase = new DeleteReviewUseCase(this._reviewService);
    this._getCommentsByReviewIdUseCase = new GetCommentsByReviewIdUseCase(this._commentService);
    this._createCommentUseCase = new CreateCommentUseCase(this._commentService);
    this._deleteCommentUseCase = new DeleteCommentUseCase(this._commentService);
  }

  getReviewService(): ReviewService {
    if (!this._reviewService) {
      throw new Error('ReviewService not initialized');
    }
    return this._reviewService;
  }

  getCommentService(): CommentService {
    if (!this._commentService) {
      throw new Error('CommentService not initialized');
    }
    return this._commentService;
  }

  getReviewRepository(): ReviewRepository {
    if (!this._reviewRepository) {
      throw new Error('ReviewRepository not initialized');
    }
    return this._reviewRepository;
  }

  getCommentRepository(): CommentRepository {
    if (!this._commentRepository) {
      throw new Error('CommentRepository not initialized');
    }
    return this._commentRepository;
  }

  // Use Case Getters
  getGetReviewsUseCase(): IGetReviewsUseCase {
    if (!this._getReviewsUseCase) {
      throw new Error('GetReviewsUseCase not initialized');
    }
    return this._getReviewsUseCase;
  }

  getGetReviewByIdUseCase(): IGetReviewByIdUseCase {
    if (!this._getReviewByIdUseCase) {
      throw new Error('GetReviewByIdUseCase not initialized');
    }
    return this._getReviewByIdUseCase;
  }

  getCreateReviewUseCase(): ICreateReviewUseCase {
    if (!this._createReviewUseCase) {
      throw new Error('CreateReviewUseCase not initialized');
    }
    return this._createReviewUseCase;
  }

  getUpdateReviewUseCase(): IUpdateReviewUseCase {
    if (!this._updateReviewUseCase) {
      throw new Error('UpdateReviewUseCase not initialized');
    }
    return this._updateReviewUseCase;
  }

  getDeleteReviewUseCase(): IDeleteReviewUseCase {
    if (!this._deleteReviewUseCase) {
      throw new Error('DeleteReviewUseCase not initialized');
    }
    return this._deleteReviewUseCase;
  }

  getGetCommentsByReviewIdUseCase(): IGetCommentsByReviewIdUseCase {
    if (!this._getCommentsByReviewIdUseCase) {
      throw new Error('GetCommentsByReviewIdUseCase not initialized');
    }
    return this._getCommentsByReviewIdUseCase;
  }

  getCreateCommentUseCase(): ICreateCommentUseCase {
    if (!this._createCommentUseCase) {
      throw new Error('CreateCommentUseCase not initialized');
    }
    return this._createCommentUseCase;
  }

  getDeleteCommentUseCase(): IDeleteCommentUseCase {
    if (!this._deleteCommentUseCase) {
      throw new Error('DeleteCommentUseCase not initialized');
    }
    return this._deleteCommentUseCase;
  }

  // Factory method for creating new instances
  static create(): IServiceContainer {
    return new ServiceContainer();
  }

  // Method for testing - allows injection of mock dependencies
  static createWithMocks(
    reviewRepository?: ReviewRepository,
    commentRepository?: CommentRepository
  ): IServiceContainer {
    const container = new ServiceContainer();
    
    if (reviewRepository) {
      container._reviewRepository = reviewRepository;
      container._reviewService = new ReviewServiceImpl(reviewRepository);
    }
    
    if (commentRepository) {
      container._commentRepository = commentRepository;
      container._commentService = new CommentServiceImpl(commentRepository);
    }
    
    return container;
  }
}

// Singleton instance for production use
export const serviceContainer = ServiceContainer.create();
