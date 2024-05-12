import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { Public } from './auth.metadata';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  createUserValidation,
  loginUserValidation,
} from './auth.validator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserValidation))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginUserValidation))
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }
}
