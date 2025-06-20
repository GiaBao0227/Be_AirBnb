import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ description: 'Tên vị trí', example: 'Hồ Gươm' })
  @IsString({ message: 'Tên vị trí phải là chuỗi!' })
  @IsNotEmpty({ message: 'Tên vị trí không được để trống!' })
  ten_vi_tri: string;

  @ApiProperty({ description: 'Tỉnh thành', example: 'Hà Nội' })
  @IsString()
  @IsNotEmpty()
  tinh_thanh: string;

  @ApiProperty({ description: 'Quốc gia', example: 'Việt Nam' })
  @IsString()
  @IsNotEmpty()
  quoc_gia: string;

  @ApiProperty({ required: false, description: 'URL hình ảnh vị trí' })
  @IsString()
  @IsOptional()
  hinh_anh?: string;
}
