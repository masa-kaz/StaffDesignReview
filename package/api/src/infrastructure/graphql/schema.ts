import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLEnumType, GraphQLNonNull, GraphQLSchema, GraphQLInputObjectType } from 'graphql';
import { Review, ReviewStatus } from '../../domain/entities/Review';
import { Comment } from '../../domain/entities/Comment';
import { GraphQLErrorHandler, ErrorType } from './errors';
import { NotFoundError } from '../../domain/errors';

// Enum Types
const ReviewStatusType = new GraphQLEnumType({
  name: 'ReviewStatus',
  values: {
    PENDING: { value: 'pending' },
    APPROVED: { value: 'approved' },
    REJECTED: { value: 'rejected' },
    IN_PROGRESS: { value: 'in_progress' }
  }
});

// Object Types
const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    reviewId: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(ReviewStatusType) },
    reviewer: { type: GraphQLString },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async (parent: Review, args: any, context: any) => {
        return await context.commentService.getCommentsByReviewId(parent.id);
      }
    }
  }
});

const PaginationType = new GraphQLObjectType({
  name: 'Pagination',
  fields: {
    page: { type: new GraphQLNonNull(GraphQLInt) },
    limit: { type: new GraphQLNonNull(GraphQLInt) },
    total: { type: new GraphQLNonNull(GraphQLInt) }
  }
});

const ReviewsResponseType = new GraphQLObjectType({
  name: 'ReviewsResponse',
  fields: {
    reviews: { type: new GraphQLList(ReviewType) },
    pagination: { type: PaginationType }
  }
});

// Response Types with Error Handling
const ReviewResponseType = new GraphQLObjectType({
  name: 'ReviewResponse',
  fields: {
    review: { type: ReviewType },
    error: { type: ErrorType }
  }
});

const CommentResponseType = new GraphQLObjectType({
  name: 'CommentResponse',
  fields: {
    comment: { type: CommentType },
    error: { type: ErrorType }
  }
});

const DeleteResponseType = new GraphQLObjectType({
  name: 'DeleteResponse',
  fields: {
    success: { type: GraphQLString },
    error: { type: ErrorType }
  }
});

// Input Types
const CreateReviewInputType = new GraphQLInputObjectType({
  name: 'CreateReviewInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    reviewer: { type: GraphQLString }
  }
});

const UpdateReviewInputType = new GraphQLInputObjectType({
  name: 'UpdateReviewInput',
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: ReviewStatusType },
    reviewer: { type: GraphQLString }
  }
});

const CreateCommentInputType = new GraphQLInputObjectType({
  name: 'CreateCommentInput',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(GraphQLString) }
  }
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      reviews: {
        type: ReviewsResponseType,
        args: {
          page: { type: GraphQLInt, defaultValue: 1 },
          limit: { type: GraphQLInt, defaultValue: 10 }
        },
        resolve: async (parent, args, context) => {
          const result = await context.reviewService.getReviews(args.page, args.limit);
          return {
            reviews: result.reviews,
            pagination: {
              page: args.page,
              limit: args.limit,
              total: result.total
            }
          };
        }
      },
      review: {
        type: ReviewResponseType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args, context) => {
          const result = await GraphQLErrorHandler.handleResolver(async () => {
            const review = await context.reviewService.getReviewById(args.id);
            if (!review) {
              throw new NotFoundError('Review', args.id);
            }
            return review;
          });
          
          return result.error ? { error: result.error } : { review: result.data };
        }
      },
      comments: {
        type: new GraphQLList(CommentType),
        args: {
          reviewId: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args, context) => {
          return await context.commentService.getCommentsByReviewId(args.reviewId);
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createReview: {
        type: ReviewResponseType,
        args: {
          input: { type: CreateReviewInputType }
        },
        resolve: async (parent, args, context) => {
          const result = await GraphQLErrorHandler.handleResolver(async () => {
            return await context.reviewService.createReview(
              args.input.title,
              args.input.description,
              args.input.reviewer
            );
          });
          
          return result.error ? { error: result.error } : { review: result.data };
        }
      },
      updateReview: {
        type: ReviewResponseType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          input: { type: UpdateReviewInputType }
        },
        resolve: async (parent, args, context) => {
          const result = await GraphQLErrorHandler.handleResolver(async () => {
            return await context.reviewService.updateReview(args.id, args.input);
          });
          
          return result.error ? { error: result.error } : { review: result.data };
        }
      },
      deleteReview: {
        type: DeleteResponseType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args, context) => {
          const result = await GraphQLErrorHandler.handleResolver(async () => {
            const success = await context.reviewService.deleteReview(args.id);
            return success ? 'Review deleted successfully' : 'Failed to delete review';
          });
          
          return result.error ? { error: result.error } : { success: result.data };
        }
      },
      createComment: {
        type: CommentResponseType,
        args: {
          reviewId: { type: new GraphQLNonNull(GraphQLString) },
          input: { type: CreateCommentInputType }
        },
        resolve: async (parent, args, context) => {
          const result = await GraphQLErrorHandler.handleResolver(async () => {
            return await context.commentService.createComment(
              args.reviewId,
              args.input.content,
              args.input.author
            );
          });
          
          return result.error ? { error: result.error } : { comment: result.data };
        }
      },
      deleteComment: {
        type: DeleteResponseType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (parent, args, context) => {
          const result = await GraphQLErrorHandler.handleResolver(async () => {
            const success = await context.commentService.deleteComment(args.id);
            return success ? 'Comment deleted successfully' : 'Failed to delete comment';
          });
          
          return result.error ? { error: result.error } : { success: result.data };
        }
      }
    }
  })
});
