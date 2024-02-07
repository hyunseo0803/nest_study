import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Connection } from 'mysql2';
import { PostDto } from './dto/board.dto';
import path from 'path';
import sharp from 'sharp';
import puppeteer from 'puppeteer';

@Injectable()
export class PostService {
  constructor(@InjectDataSource() private connecion: Connection) {}
  //리스트조회
  async findAll() {
    const i = 1;
    return await this.connecion.query('select * from board');
  }

  //게시글 생성
  async create(postDto: PostDto) {
    return await this.connecion.query('insert into board set?', postDto);
  }

  //게시글 상세조회
  async findOne(id: number) {
    return await this.connecion.query('select * from board where no =?', id);
  }

  //게시글 제목 중복 체크
  async findOneByTitle(title: string) {
    const exist = await this.connecion.query(
      'select count(*) as cnt from board where title =?',
      title,
    );
    if (exist[0].cnt > 0) {
      return true;
    } else {
      return false;
    }
  }

  //게시글 수정
  async update(id: number, postDto: PostDto) {
    return await this.connecion.query('update board set? where no =?', [
      postDto,
      id,
    ]);
  }
  //게시글 삭제
  delete(id: number) {
    return this.connecion.query('delete from board where no=?', id);
  }

  // html to pdf
  async htmlToPdf(html: string) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html);
    const path = './pdf/안전작업계획서' + Date.now() + '.pdf';
    await page.pdf({ path: path, format: 'A4' });
    await browser.close();
    return path;
  }
}
