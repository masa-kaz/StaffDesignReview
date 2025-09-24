import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { DomainError } from '../../domain/errors';

// GraphQL Error Response Type
export const ErrorType = new GraphQLObjectType({
  name: 'Error',
  fields: {
    code: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    field: { type: GraphQLString }
  }
});

// Error Handler
export class GraphQLErrorHandler {
  static formatError(error: any) {
    // Domain errors
    if (error instanceof DomainError) {
      return {
        message: error.message,
        code: error.code,
        extensions: {
          code: error.code,
          type: error.constructor.name
        }
      };
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      return {
        message: error.message,
        code: 'VALIDATION_ERROR',
        extensions: {
          code: 'VALIDATION_ERROR',
          type: 'ValidationError'
        }
      };
    }

    // Generic errors
    return {
      message: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
      extensions: {
        code: 'INTERNAL_ERROR',
        type: 'InternalError'
      }
    };
  }

  static async handleResolver<T>(
    resolver: () => Promise<T>
  ): Promise<{ data?: T; error?: any }> {
    try {
      const data = await resolver();
      return { data };
    } catch (error) {
      return { error: this.formatError(error) };
    }
  }
}
