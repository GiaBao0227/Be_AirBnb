import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination-user.dto';
import { AdduserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProtectGuard } from '../auth/protect/protect.guard';
import { uploadConfig } from 'src/config/upload.config';
import { UploadFileDto } from 'src/common/dto/upload-file.dto';

@ApiTags('User')
@ApiBearerAuth('AccessToken')
@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private checkAdmin(req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Yêu cầu quyền Admin để thực hiện hành động này.',
      );
    }
  }

  @Get('LayDanhSachNguoiDung')
  async getAllUser(@Req() req: any) {
    this.checkAdmin(req);
    return await this.userService.getAllUser();
  }

  @Get('LayDanhSachNguoiDungPhanTrang')
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
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search: string,
    @Req() req: any,
  ) {
    this.checkAdmin(req);
    const paginationDto: PaginationDto = {
      page,
      pageSize,
      search,
    };
    return this.userService.getAllUserPagination(paginationDto);
  }

  @Get('TimKiemNguoiDung')
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Tài khoản cần tìm kiếm',
    example: 'Quốc',
  })
  async searchUser(@Query('name') name: string, @Req() req: any) {
    this.checkAdmin(req);
    return this.userService.searchUser(name);
  }

  @Post('ThemNguoiDung')
  async addUser(
    @Body()
    body: AdduserDto,
    @Req() req: any,
  ) {
    this.checkAdmin(req);
    return this.userService.addUser(body);
  }

  @Delete('XoaNguoiDung')
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Tài khoản cần xóa',
    example: 'nguyenvana@gmail.com',
  })
  async deleteUser(@Query('email') email: string, @Req() req: any) {
    this.checkAdmin(req);
    return this.userService.deleteUser(email);
  }

  @Put('CapNhatThongTinNguoiDung/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req: any,
  ) {
    this.checkAdmin(req);
    return this.userService.updateUser(Number(id), body);
  }

  @Get('LayThongTinNguoiDung')
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Tài khoản cần lấy thông tin',
    example: 'nguyenvana@gmail.com',
  })
  async getUserInfo(@Query('email') email: string, @Req() req: any) {
    this.checkAdmin(req);
    return this.userService.getUserInfo(email);
  }

  @Get('LayDanhSachLoaiNguoiDung')
  async getAllUserType(@Req() req: any) {
    this.checkAdmin(req);
    return await this.userService.getAllUserType();
  }

  @Post('/:id/uploadAvatar')
  @UseInterceptors(uploadConfig('avatars', 2))
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID người dùng',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload avatar',
    type: UploadFileDto,
  })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadAvatar(+id, file);
  }
}
