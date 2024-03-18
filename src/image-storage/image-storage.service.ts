import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import ImageKit from 'imagekit';
import { IStoreFile } from './image.interface';
import { Express } from 'express';
@Injectable()
export class ImageStorageService {
  constructor(@Inject('IMAGE_KIT') private imageKit: ImageKit) {}

  async storeImage(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<IStoreFile> {
    let image: IStoreFile | null = null;
    try {
      const buffer = file.buffer;
      const res = await this.imageKit.upload({
        file: buffer,
        fileName: file.originalname,
        folder: folderName,
      });
      image = {
        fileId: res.fileId,
        url: res.url,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException({
        message: 'Server error, unable to save the image',
      });
    }
    return image;
  }
}
