import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsOptional()
    @IsString({message: 'id phải là chuỗi'})
    id : string;
    @IsString({message: 'email phải là chuỗi'})
    @IsNotEmpty({ message: 'email không được để trống'})
    @ApiProperty({ example: 'vovanquoc0201@gmail.com' })
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'Email không đúng định dạng' })
    email: string;
    @IsString({message: 'Password phải là chuỗi'})
    @IsNotEmpty({ message: 'Password không được để trống'})
    @ApiProperty({ example: '123456' })
    password: string;
}