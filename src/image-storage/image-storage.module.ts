import { Module, Provider } from '@nestjs/common';
import { ImageStorageService } from './image-storage.service';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

const ImageKitProvider: Provider = {
  provide: 'IMAGE_KIT',
  useFactory: (configService: ConfigService) => {
    return new ImageKit({
      publicKey: configService.get<string>('IMAGEKIT_PUBLIC_KEY'),
      privateKey: configService.get<string>('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: configService.get<string>('IMAGEKIT_URL_ENDPOINT'),
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [ImageStorageService, ImageKitProvider],
  exports: [ImageKitProvider, ImageStorageService],
})
export class ImageStorageModule {}
