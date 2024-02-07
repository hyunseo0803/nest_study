import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      // 업로드 폴더 저장 경로, 폴더 미리 생성되어 있어야함
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './upload');
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
