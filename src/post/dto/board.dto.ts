import {ApiProperty} from "@nestjs/swagger";

export class PostDto {
    @ApiProperty({
        type: String,
        description: '게시글 제목'
    })
    title: string;
    @ApiProperty({
        type: String,
        description: '게시글 내용'
    })
    content: string;
    @ApiProperty({
        type: String,
        description: '게시글 주소'
    })
    address: string;
}