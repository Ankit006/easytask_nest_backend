import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';

import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  createUserValidation,
  loginUserValidation,
} from './auth.validator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserValidation))
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.register({ response, ...createUserDto });
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginUserValidation))
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login({ response, ...loginUserDto });
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
