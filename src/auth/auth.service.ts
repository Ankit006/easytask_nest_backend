import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { IStoreFile } from 'src/image-storage/image.interface';
import { User } from 'src/schemas/user.schema';
import { SignupBodyDto } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private ImageStoreService: ImageStorageService,
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
      const user = new this.userModel({ profilePic: logo, ...singupbodyDto });
      await user.save();
      return user;
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'server error, unable to create user',
        error: err,
      });
    }
  }
}
