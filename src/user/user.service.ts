import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Connection } from 'mysql2';
import { UserDto } from './dto/user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectDataSource() private connecion: Connection) {}
  async signup(id: String, nickname: String, pw: String, role: string) {
    const infoinsert = await this.connecion.query(
      'insert into member(id,nickname,pw,role) value(?,?,?,?)',
      [id, nickname, pw, role],
    );

    return infoinsert;
  }

  async login(id: String) {
    return await this.connecion.query('select * from member where id =?', [id]);
  }
}
