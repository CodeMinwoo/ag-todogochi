import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailCheckReqBodyDto,
  SignInKakaoReqBodyDto,
  SignInReqBodyDto,
  SignUpReqBodyDto,
} from './dto/auth-req.dto';
import { Response, Request } from 'express';
import { Swagger } from 'src/common/decorators/swagger.decorator';
import { AUTH_DOCS } from './constant/auth.swagger';
import { REFRESH_TOKEN_MAX_AGE } from './constant/refresh-token-max-age.constant';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { COOKIE } from 'src/common/constants/cookie.constant';

const logger = new Logger('AuthController');

@Swagger(AUTH_DOCS.AUTH_CONTROLLER)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Swagger(AUTH_DOCS.SIGN_UP)
  @Post('sign-up')
  async signUp(@Body() body: SignUpReqBodyDto, @Res() res: Response) {
    const response = await this.authService.signUp(body);
    const { user, tokens } = response.data;
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.status(response.status).json({
      user,
      accessToken: tokens.accessToken,
    });
  }

  @Swagger(AUTH_DOCS.EMAIL_CHECK)
  @Post('email-check')
  async emailCheck(@Body() body: EmailCheckReqBodyDto, @Res() res: Response) {
    const response = await this.authService.emailCheck(body);

    return res.status(response.status).json(response.data);
  }

  @Swagger(AUTH_DOCS.SIGN_IN)
  @Post('sign-in')
  async signIn(@Body() body: SignInReqBodyDto, @Res() res: Response) {
    const response = await this.authService.signIn(body);
    const { user, tokens } = response.data;
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.status(response.status).json({
      user,
      accessToken: tokens.accessToken,
    });
  }

  @Swagger(AUTH_DOCS.SIGN_IN_KAKAO)
  @Post('sign-in/kakao')
  async signInKakao(@Body() body: SignInKakaoReqBodyDto, @Res() res: Response) {
    // this.logger.log('sign-in/kakao incoming :: ', body);
    const response = await this.authService.signInKakao(body);
    const { user, tokens } = response.data;
    // res.cookie('refreshToken', tokens.refreshToken, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    //   maxAge: REFRESH_TOKEN_MAX_AGE,
    // });
    // this.logger.log(response.data);
    logger.log('response :: ', response.data);
    return res.status(response.status).json({
      user,
      accessToken: tokens.accessToken,
    });
  }

  @Post('refresh')
  async refreshAccessToken(
    @Res() res: Response,
    @Cookie(COOKIE.REFRESH) oldRefreshToken: string,
  ) {}
}
