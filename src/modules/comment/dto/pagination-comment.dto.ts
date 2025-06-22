import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationCommentDto {
  @ApiPropertyOptional({
    description: 'Số trang muốn lấy, bắt đầu từ 1.',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Số lượng bình luận trên mỗi trang.',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @IsString()
  pageSize?: string;

  @ApiPropertyOptional({
    description: 'Từ khóa để tìm kiếm theo nội dung bình luận.',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
