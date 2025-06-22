import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationLocationDto {
  @ApiPropertyOptional({
    description: 'Số trang muốn lấy, bắt đầu từ 1.',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Số lượng vị trí trên mỗi trang.',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @IsString()
  pageSize?: string;

  @ApiPropertyOptional({
    description:
      'Từ khóa để tìm kiếm theo tên vị trí (không phân biệt hoa thường).',
    example: 'Hội An',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
