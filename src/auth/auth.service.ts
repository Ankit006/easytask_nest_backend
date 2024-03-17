import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async registerUser(singupbodyDto: SignupBodyDto) {
    const user = await this.userModel.findOne({ email: singupbodyDto.email });
    if (user) {
      throw new ConflictException('User already exist');
    }

    let logo: IStoreFile | null = null;

    if (singupbodyDto.file) {
      logo = await this.ImageStoreService.storeImage(
        singupbodyDto.file,
        'userProfilePic',
      );
    }

    try {
      const user = new this.userModel({ profilePic: logo, ...singupbodyDto });
      await user.save();
      return user;
    } catch (err) {
      throw new InternalServerErrorException(
        'server error, unable to create user',
      );
    }
  }
}
