import { ApolloServer } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { schema } from '../../infrastructure/graphql/schema';
import { GraphQLErrorHandler } from '../../infrastructure/graphql/errors';
import { serviceContainer } from '../../infrastructure/container/ServiceContainer';

const apolloServer = new ApolloServer({
  schema,
  context: () => ({
    reviewService: serviceContainer.getReviewService(),
    commentService: serviceContainer.getCommentService()
  }),
  introspection: true,
  formatError: GraphQLErrorHandler.formatError
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
