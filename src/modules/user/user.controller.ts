import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ForbiddenException,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination-user.dto';
import { AdduserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProtectGuard } from '../auth/protect/protect.guard';

@ApiTags('User')
@ApiBearerAuth('AccessToken')
@UseGuards(ProtectGuard)
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
  async getAllUser(@Request() req: any) {
    this.checkAdmin(req);
    return this.userService.getAllUser();
  }

  @Get('LayDanhSachNguoiDungPhanTrang')
  async getAllUserPagination(
    @Query() paginationDto: PaginationDto,
    @Request() req: any,
  ) {
    this.checkAdmin(req);
    return this.userService.getAllUserPagination(paginationDto);
  }

  @Get('TimKiemNguoiDung')
  @ApiQuery({ name: 'name', required: true })
  async searchUser(@Query('name') name: string, @Request() req: any) {
    this.checkAdmin(req);
    return this.userService.searchUser(name);
  }

  @Post('ThemNguoiDung')
  async addUser(@Body() body: AdduserDto, @Request() req: any) {
    this.checkAdmin(req);
    return this.userService.addUser(body);
  }

  @Delete('XoaNguoiDung')
  @ApiQuery({ name: 'email', required: true })
  async deleteUser(@Query('email') email: string, @Request() req: any) {
    this.checkAdmin(req);
    return this.userService.deleteUser(email);
  }

  @Put('CapNhatThongTinNguoiDung/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
    @Request() req: any,
  ) {
    this.checkAdmin(req);
    return this.userService.updateUser(id, body);
  }

  @Get('LayThongTinNguoiDung')
  @ApiQuery({ name: 'email', required: true })
  async getUserInfo(@Query('email') email: string, @Request() req: any) {
    this.checkAdmin(req);
    return this.userService.getUserInfo(email);
  }

  @Get('LayDanhSachLoaiNguoiDung')
  async getAllUserType(@Request() req: any) {
    this.checkAdmin(req);
    return await this.userService.getAllUserType();
  }
}
