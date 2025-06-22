import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Tên phòng', example: 'Căn hộ trung tâm Q1' })
  @IsString({ message: 'Tên phòng phải là chuỗi' })
  ten_phong: string;

  @ApiProperty({ description: 'Số lượng khách tối đa', example: 4 })
  @Type(() => Number)
  @IsNumber({}, { message: 'khach phải là số' })
  @Min(1, { message: 'khach phải >= 1' })
  khach: number;

  @ApiProperty({ description: 'Số phòng ngủ', example: 2 })
  @Type(() => Number)
  @IsNumber({}, { message: 'phong_ngu phải là số' })
  @Min(1, { message: 'phong_ngu phải >= 1' })
  phong_ngu: number;

  @ApiProperty({ description: 'Số giường', example: 2 })
  @Type(() => Number)
  @IsNumber({}, { message: 'giuong phải là số' })
  @Min(1, { message: 'giuong phải >= 1' })
  giuong: number;

  @ApiProperty({ description: 'Số phòng tắm', example: 1 })
  @Type(() => Number)
  @IsNumber({}, { message: 'phong_tam phải là số' })
  @Min(0, { message: 'phong_tam phải >= 0' })
  phong_tam: number;

  @ApiPropertyOptional({
    description: 'Mô tả phòng',
    example: 'Gần công viên, yên tĩnh',
  })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiProperty({ description: 'Giá tiền (VND)', example: 500000 })
  @Type(() => Number)
  @IsNumber({}, { message: 'gia_tien phải là số' })
  @Min(0, { message: 'gia_tien phải >= 0' })
  gia_tien: number;

  @ApiPropertyOptional({ description: 'Có máy giặt không', example: true })
  @IsOptional()
  @IsBoolean()
  may_giat?: boolean;

  @ApiPropertyOptional({ description: 'Có bàn là không', example: true })
  @IsOptional()
  @IsBoolean()
  ban_la?: boolean;

  @ApiPropertyOptional({ description: 'Có tivi không', example: false })
  @IsOptional()
  @IsBoolean()
  tivi?: boolean;

  @ApiPropertyOptional({ description: 'Có điều hòa không', example: true })
  @IsOptional()
  @IsBoolean()
  dieu_hoa?: boolean;

  @ApiPropertyOptional({ description: 'Có wifi không', example: true })
  @IsOptional()
  @IsBoolean()
  wifi?: boolean;

  @ApiPropertyOptional({ description: 'Có bếp không', example: false })
  @IsOptional()
  @IsBoolean()
  bep?: boolean;

  @ApiPropertyOptional({ description: 'Có chỗ đỗ xe không', example: true })
  @IsOptional()
  @IsBoolean()
  do_xe?: boolean;

  @ApiPropertyOptional({ description: 'Có hồ bơi không', example: false })
  @IsOptional()
  @IsBoolean()
  ho_boi?: boolean;

  @ApiPropertyOptional({ description: 'Có bàn ủi không', example: false })
  @IsOptional()
  @IsBoolean()
  ban_ui?: boolean;

  @ApiPropertyOptional({
    description: 'Link ảnh phòng',
    example: 'https://cdn.pixabay.com/photo/1.jpg',
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({ description: 'ID vị trí', example: 2 })
  @Type(() => Number)
  @IsNumber()
  vi_tri_id: number;
}
