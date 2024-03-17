import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import ImageKit from 'imagekit';
import { IStoreFile } from './image.interface';
@Injectable()
export class ImageStorageService {
  constructor(@Inject('IMAGE_KIT') private imageKit: ImageKit) {}

  async storeImage(file: any, folderName: string): Promise<IStoreFile> {
    let image: IStoreFile | null = null;
    try {
      const buffer = file.toBuffer();
      const res = await this.imageKit.upload({
        file: buffer,
        fileName: file.filename,
        folder: folderName,
      });
      image = {
        fileId: res.fileId,
        url: res.url,
      };
    } catch (err) {
      throw new InternalServerErrorException(
        'Server error, unable to save the image',
      );
    }
    return image;
  }
}
