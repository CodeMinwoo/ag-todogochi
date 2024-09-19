import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/common/constants/role.constant';
import { ApiError } from 'src/common/error/api.error';
import { UserService as UserServer } from 'src/provider/server/services/user.service';

@Injectable()
export class UserService {
  constructor(private readonly userService: UserServer) {}

  async getCoinTransactionsByUserId(input: { userId: number; req: any }) {
    if (
      input.req.user.role < ROLE.ADMIN &&
      input.req.user.userId !== input.userId
    ) {
      throw new ApiError('AG-0001');
    }
    const response = await this.userService.get({
      path: `/user/${input.userId}/coin-transactions`,
    });

    return { data: response.data, status: response.status };
  }
}
