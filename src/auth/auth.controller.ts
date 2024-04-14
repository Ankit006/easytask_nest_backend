import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  createUserValidation,
  CreateUserDto,
} from 'src/database/database.validator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserValidation))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
