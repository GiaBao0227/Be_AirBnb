import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Mã phòng cần bình luận', example: 1 })
  @IsInt()
  @IsNotEmpty()
  ma_phong: number;

  @ApiProperty({ description: 'Nội dung bình luận', example: 'Phòng rất đẹp!' })
  @IsString()
  @IsNotEmpty()
  noi_dung: string;

  @ApiProperty({ description: 'Số sao đánh giá (từ 1 đến 5)', example: 5 })
  @IsInt()
  @Min(1, { message: 'Số sao phải lớn hơn hoặc bằng 1' })
  @Max(5, { message: 'Số sao phải nhỏ hơn hoặc bằng 5' })
  @IsNotEmpty()
  sao_binh_luan: number;
}
