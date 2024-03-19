import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MongooseExceptionFilter } from 'src/exception/mongoose.exception';
import { zodErrorFormatter } from 'src/utils';
import { AuthService } from './auth.service';
import { SignUpBodySchema, SignupBodyDto } from './auth.validation';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @UseFilters(MongooseExceptionFilter)
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .addFileTypeValidator({
          fileType: '.(png|jpe?g|webp)$',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Body() signupBodyDto: SignupBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsedBody = SignUpBodySchema.safeParse(signupBodyDto);
    if (parsedBody.success === true) {
      const result = await this.authService.registerUser(signupBodyDto, file);
      res.cookie('authToken', result.token, {
        domain: this.configService.get<string>('FRONTEND_URL'),
        path: '/',
        secure: true,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 24 * 60 * 60,
      });
      return { message: 'You are registered successfully' };
    } else {
      const error = zodErrorFormatter(parsedBody.error.errors);
      throw new UnprocessableEntityException(error);
    }
  }
}
