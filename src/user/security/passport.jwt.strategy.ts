import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UserService } from '../user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './payload.interface';

//jwt 검증 및 전략 정의
@Injectable()
//생성한 jwtstrategy클래스는 passport에서 제공하는 passportStrategy를 따름
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      // 추출방법: 클라이언트는 토큰 값을 Header에 Bearer Token 값으로 실어 보내야함
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // 토큰이 만료되거나 문제가 발생하면 Passport는 Error 발생
  // 토큰 검증을 완료하면 validate() 메서드가 실행
  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.userService.login(payload.id);
    console.log('validate 메서드 호츨됨');
    if (!user) {
      return done(
        new UnauthorizedException({ message: 'user does not exist' }),
        false,
      );
    }
    return done(null, user);
  }
}
