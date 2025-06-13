import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class AdduserDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  pass_word: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '2000-01-01', required: false })
  @IsOptional()
  @IsDateString()
  birth_day?: string;

  @ApiProperty({ example: 'male', enum: ['male', 'female', 'other'], required: false })
  @IsOptional()
  @IsIn(['male', 'female', 'other'], { message: 'Giới tính phải là male, female hoặc other' })
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({ example: 'admin', required: false })
  @IsOptional()
  @IsString()
  role?: string;
}
