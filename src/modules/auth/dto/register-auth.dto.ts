import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches, IsEmail, IsEnum, IsDateString } from 'class-validator';
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ tên của bạn' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  name: string;

  @ApiProperty({ example: 'nguyenvana123@gmail.com', description: 'Email của bạn' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: 'Email không đúng định dạng',
    })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu của bạn' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @ApiProperty({ example: '0123456789', description: 'Số điện thoại của bạn' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({ example: '2005-12-31', description: 'Ngày sinh định dạng yyyy-mm-dd' })
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng yyyy-mm-dd' })
  birthday: string;

  @ApiProperty({ example: 'male', enum: Gender, description: 'Giới tính của bạn' })
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ, chỉ chấp nhận male, female hoặc other' })
  gender: Gender;
}
