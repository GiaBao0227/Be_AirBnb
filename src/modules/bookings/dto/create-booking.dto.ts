import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Mã phòng', example: '0' })
  @Type(() => Number)
  @IsNumber({}, { message: 'ma_phong phải là số' })
  ma_phong: number;

  @ApiProperty({ description: 'Ngày đến', example: '2025-06-01 00:00:00' })
  @Type(() => Date)
  @IsDate({
    message: 'ngay_den phải là ngày theo định dạng yyyy-mm-dd hh:mm:ss',
  })
  ngay_den: string;

  @ApiProperty({ description: 'Ngày đi', example: '2025-06-01 00:00:00' })
  @Type(() => Date)
  @IsDate({
    message: 'ngay_di phải là ngày theo định dạng yyyy-mm-dd hh:mm:ss',
  })
  ngay_di: string;

  @ApiProperty({ description: 'Số lượng khách', example: '1' })
  @Type(() => Number)
  @IsNumber({}, { message: 'so_luong_khach phải là số' })
  @Min(1, { message: 'so_luong_khach phải >= 1' })
  so_luong_khach: number;

  @ApiProperty({ description: 'Mã người đặt', example: '0' })
  @Type(() => Number)
  @IsNumber({}, { message: 'ma_nguoi_dat phải là số' })
  ma_nguoi_dat: number;
}
