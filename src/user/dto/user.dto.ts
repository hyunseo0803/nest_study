import { ApiProperty } from '@nestjs/swagger';
import { Column, OneToMany, JoinColumn } from 'typeorm';

export class UserDto {
  @ApiProperty({
    type: String,
    description: '회원 아이디',
  })
  id: string;
  @ApiProperty({
    type: String,
    description: '회원 비밀번호',
  })
  pw: string;
  @ApiProperty({
    type: String,
    description: '회원 닉네임',
  })
  nickname: string;

  @ApiProperty({
    type: String,
    description: '회원 역할',
  })
  role: string;

  // @OneToMany(() => AuthDto, (userAuthority) => userAuthority.user, {
  //   eager: true,
  // })
  // authorities: any[];
}
