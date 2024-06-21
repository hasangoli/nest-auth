import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

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
}
