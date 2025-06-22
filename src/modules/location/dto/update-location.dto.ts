import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @ApiPropertyOptional({ description: 'Tên vị trí mới' })
  @IsString()
  @IsOptional()
  ten_vi_tri?: string;

  @ApiPropertyOptional({ description: 'Tỉnh thành mới' })
  @IsString()
  @IsOptional()
  tinh_thanh?: string;

  @ApiPropertyOptional({ description: 'Quốc gia mới' })
  @IsString()
  @IsOptional()
  quoc_gia?: string;

  @ApiPropertyOptional({ description: 'URL hình ảnh mới' })
  @IsString()
  @IsOptional()
  hinh_anh?: string;
}
