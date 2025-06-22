import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  IsIn,
  IsDateString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi' })
  @ApiPropertyOptional({
    example: 'Nguyễn Văn B',
    description: 'Tên người dùng',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Email phải là chuỗi' })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Email không đúng định dạng',
  })
  @ApiPropertyOptional({
    example: 'nguyenvanb@gmail.com',
    description: 'Email người dùng',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @ApiPropertyOptional({
    example: '123456',
    description: 'Mật khẩu người dùng (mã hoá lại phía BE)',
  })
  pass_word?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @ApiPropertyOptional({
    example: '0123456789',
    description: 'Số điện thoại người dùng',
  })
  phone?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày sinh không đúng định dạng ISO (YYYY-MM-DD)' },
  )
  @ApiPropertyOptional({
    example: '2000-01-01',
    description: 'Ngày sinh người dùng',
  })
  birth_day?: string;

  @IsOptional()
  @IsString({ message: 'Giới tính phải là chuỗi' })
  @IsIn(['male', 'female', 'other'], {
    message: 'Giới tính chỉ được là "male", "female" hoặc "other"',
  })
  @ApiPropertyOptional({
    example: 'male',
    description: 'Giới tính (male | female | other)',
    enum: ['male', 'female', 'other'],
  })
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsString({ message: 'Vai trò phải là chuỗi' })
  @ApiPropertyOptional({
    example: 'admin',
    description: 'Vai trò người dùng (admin | guest | host ...)',
  })
  role?: string;
}
