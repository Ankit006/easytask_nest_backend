import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { SignUpBodySchema, SignupBodyDto } from './auth.validation';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(SignUpBodySchema))
  async register(@Body() signupBodyDto: SignupBodyDto) {
    const res = await this.authService.registerUser(signupBodyDto);
    return res;
  }
}
