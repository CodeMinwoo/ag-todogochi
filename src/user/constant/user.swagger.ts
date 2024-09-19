import { SwaggerOptions } from 'src/common/decorators/swagger.decorator';

export const USER_DOCS: Record<string, SwaggerOptions> = {
  USER_CONTROLLER: {
    apiTags: 'User',
  },
  GET_COIN_TRANSACTIONS_BY_USER_ID: {
    operation: {
      summary: 'Get coin transactions by user id',
      description: 'This endpoint retrieves coin transactions by user id.',
    },
    bearerAuth: true,
    response: {
      status: 200,
      // TODO: Create a DTO for this response
    },
  },
};
