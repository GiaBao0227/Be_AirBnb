import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination-user.dto';
import { AdduserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('QuanLyNguoiDung')
export class UserController {
    constructor (private readonly userService : UserService){}

    @Get('LayDanhSachNguoiDung')
    @ApiBearerAuth('AccessToken')
    async getAllUser(){
        return await this.userService.getAllUser();
    }

    @Get('LayDanhSachNguoiDungPhanTrang')
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Nếu không truyền thì mặc định là 1',
        example: '1',
      })
      @ApiQuery({
        name: 'pageSize',
        required: false,
        description: 'Nếu không truyền thì mặc định là 3',
        example: '3',
      })
      @ApiQuery({
        name: 'search',
        required: false,
        description: 'Từ khóa tìm kiếm',
        example: 'quoc',
      })
    async getAllUserPagination(
        @Query('page') page: string ,
        @Query('pageSize') pageSize: string,
        @Query('search') search: string
      ) {
        const paginationDto: PaginationDto = {
          page,
          pageSize,
          search,
        };
        return this.userService.getAllUserPagination(paginationDto);
    }


    @Get('TimKiemNguoiDung')
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'name',
        required: true,
        description: 'Tài khoản cần tìm kiếm',
        example: 'Quốc',
    })
    async searchUser (
        @Query('name') name:string
    ){
        return this.userService.searchUser(name)
    }


    @Post('ThemNguoiDung')
    @ApiBearerAuth('AccessToken')
    async addUser(
        @Body()
        body : AdduserDto
    ){
        return this.userService.addUser(body)
    }

    @Delete('XoaNguoiDung')
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'email',
        required: true,
        description: 'Tài khoản cần xóa',
        example: 'nguyenvana@gmail.com',
    })
    async deleteUser(
        @Query('email') email:string
    ){
        return this.userService.deleteUser(email)
    }

    @Put('CapNhatThongTinNguoiDung/:id')
    @ApiBearerAuth('AccessToken')
    async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto
    ) {
     return this.userService.updateUser(Number(id), body);
    }

    @Get('LayThongTinNguoiDung')
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
        name: 'email',
        required: true,
        description: 'Tài khoản cần lấy thông tin',
        example: 'nguyenvana@gmail.com'
    })
    async getUserInfo(
        @Query('email') email: string
    ){
        return this.userService.getUserInfo(email)
    }

    @Get('LayDanhSachLoaiNguoiDung')
    @ApiBearerAuth('AccessToken')
    async getAllUserType(){
        return await this.userService.getAllUserType()
    }
}
