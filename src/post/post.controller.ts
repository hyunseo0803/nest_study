import { PostService } from './post.service';
import { PostDto } from './dto/board.dto';
import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { ok } from 'assert';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import * as sharp from 'sharp';
import pdf from 'html-pdf';
import puppeteer from 'puppeteer';
import jsPDF from 'jspdf';
import { date } from 'joi';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //리스트 조회
  @Get('/all')
  async getAll() {
    return await this.postService.findAll();
  }

  //게시글 생성
  @Post('/create')
  async create(@Body() postDto: PostDto, @Res() res: Response) {
    //제목 중복 체크
    const duplicate = await this.postService.findOneByTitle(postDto.title);
    if (duplicate) {
      res.status(500).json({ error: '이미 존재하는 게시글 제목 입니다.' });
    } else {
      return await this.postService.create(postDto);
    }
  }

  //게시글 상세조회
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.postService.findOne(id);
  }

  //게시글 수정
  @Post('/update/:id')
  async update(@Param('id') id: number, @Body() postDto: PostDto) {
    return await this.postService.update(id, postDto);
  }

  //게시글 삭제
  @Delete('/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.postService.delete(id);
  }

  //파일 업로드 - 원본 및 압축된 이미지
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImg(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    console.log(file.filename);
    const original = file.filename;
    //reizedUploadPath 폴더 미리 생성되어 있어야함
    const resizedUploadPath = './resizedUpload/' + original;
    const image = await sharp(file.path)
      .resize(500, 500, { fit: 'contain' })
      .toFile(resizedUploadPath, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `리사이징 이미지 info : ${JSON.stringify(info, null, 2)}`,
          );
          return res.sendFile(original, {
            root: 'resizedUpload',
          });
        }
      });
  }

  //이미지 불러오기 - 상대경로
  @Get('/upload/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: 'upload' });
  }

  // html to pdf 방법 3가지 -------------
  // 1. html - pdf : 삭제됨 -> 사용불가
  // 2. Puppeteer
  // 3. jsPDF -> html 인식 불가
  @Post('/Puppeteer')
  async Puppeteer(@Body() body, @Res() res: Response) {
    try {
      const pdfOk = await this.postService.htmlToPdf(body.html);
      res.status(200).json({ message: pdfOk });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
