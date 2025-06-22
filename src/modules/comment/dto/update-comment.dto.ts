import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: 'Nội dung bình luận mới' })
  @IsString()
  @IsOptional()
  noi_dung?: string;

  @ApiPropertyOptional({ description: 'Số sao đánh giá mới (từ 1 đến 5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  sao_binh_luan?: number;
}
