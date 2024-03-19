import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SignupBodyDto } from './auth.validation';
import { MongooseExceptionFilter } from 'src/exception/mongoose.exception';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  ) {
    const res = await this.authService.registerUser(signupBodyDto, file);
    return res;
  }
}
