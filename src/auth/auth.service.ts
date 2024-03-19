import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { IStoreFile } from 'src/image-storage/image.interface';
import { User } from 'src/schemas/user.schema';
import { SignupBodyDto } from './auth.validation';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private ImageStoreService: ImageStorageService,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    singupbodyDto: SignupBodyDto,
    file: Express.Multer.File | undefined,
  ) {
    let logo: IStoreFile | null = null;

    if (file) {
      logo = await this.ImageStoreService.storeImage(file, 'userProfilePic');
    }

    try {
      const hashedPassword = await argon2.hash(singupbodyDto.password);
      const user = new this.userModel({
        profilePic: logo,
        ...singupbodyDto,
        password: hashedPassword,
      });
      await user.save();
      const token = await this.jwtService.signAsync({ email: user.email });
      return { user, token };
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'server error, unable to create user',
        error: err,
      });
    }
  }
}
