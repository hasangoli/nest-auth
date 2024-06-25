import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthType } from './enums/auth-type.enum';
import { OtpAuthenticationService } from './otp-authentication.service';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly otpAuthenticationService: OtpAuthenticationService,
  ) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signUp(signUpDto);
  }

  // Sends jwt token in response body
  // @HttpCode(HttpStatus.OK)
  // @Post('sign-in')
  // signIn(@Body() signInDto: SignInDto) {
  //   return this.authenticationService.signIn(signInDto);
  // }

  // Sends jwt token in header cookie
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const accessToken = await this.authenticationService.signIn(signInDto);
    response.cookie('accessToken', {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(refreshTokenDto);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUserData: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthenticationService.generateSecret(
      activeUserData.email,
    );

    await this.otpAuthenticationService.enableTfaForUser(
      activeUserData.email,
      secret,
    );

    response.type('png');

    return toFileStream(response, uri);
  }
}
