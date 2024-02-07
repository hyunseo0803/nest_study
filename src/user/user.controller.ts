import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { Console } from 'console';
import { Payload } from './security/payload.interface';
import { AuthDto } from './dto/auth.dto';
import { AuthCuard } from './security/auth.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    //jwtService 사용
    private jwtService: JwtService,
  ) {}

  // 회원가입 - 비밀번호 bcrypt.hash로 암호화
  @Post('/signup')
  async signup(@Body() userDto: UserDto, @Body() authDto: AuthDto) {
    // console.log(userDto.pw);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.pw, salt);
    // console.log(hashedPassword);
    return await this.userService.signup(
      userDto.id,
      userDto.nickname,
      hashedPassword,
      authDto.role,
    );
  }

  // 로그인 - bcrypt.compare로 비밀번호 검증 , 예외 처리
  @Get('/login')
  async login(
    @Query('id') id: String,
    @Query('pw') pw: String,
    @Res() res: Response,
  ) {
    const userInfo = await this.userService.login(id);
    if (Object.keys(userInfo).length !== 0) {
      const validUser = await bcrypt.compare(pw, userInfo[0]['pw']);
      if (validUser) {
        const payload: Payload = { id: userInfo[0]['id'] };
        const jwtToken = await this.jwtService.sign(payload);
        res.setHeader('Authorization', 'Bearer' + jwtToken);
        // 로그인 성공시, 토큰 생성
        return res.json(jwtToken);
      } else {
        return '아이디와 비밀번호가 일치하지 않습니다.';
      }
    } else {
      return '존재하지 않는 계정입니다.';
    }
  }

  @Get('/authentication')
  // AuthGuard 가 자동으로 PassportStrategy를 상속받은 JwtStrategy를 찾아 로직 수행
  @UseGuards(AuthCuard)
  isAuthenticated(@Req() req: Request) {
    const user = req.user;
    console.log(user);
    return user;
  }

  @Post('/adminPage')
  @UseGuards(AuthCuard)
  @Roles(Role.Admin)
  async page() {
    return 'adminPage';
  }
}
