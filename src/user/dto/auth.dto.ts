import { ApiProperty } from '@nestjs/swagger';
import { Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserDto } from './user.dto';

export class AuthDto {
  @ApiProperty({
    type: String,
    description: '회원 아이디',
  })
  @Column('varchar', { name: 'member_id' })
  id: string;

  @ApiProperty({
    type: String,
    description: '회원 역할',
  })
  role: string;

  @ManyToOne(() => UserDto)
  @JoinColumn({ name: 'member_id' })
  user: UserDto;
}
