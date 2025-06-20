// src/modules/comment/comment.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationCommentDto } from './dto/pagination-comment.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { ProtectGuard } from '../auth/protect/protect.guard';

@ApiTags('Comment')
@Controller('Comment') // Giống với controller Location
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // --- API LẤY DANH SÁCH BÌNH LUẬN (PHÂN TRANG & TÌM KIẾM) ---
  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Get('LayDanhSachBinhLuanPhanTrang') // Đổi tên cho đồng bộ
  findAllWithPagination(@Query() paginationDto: PaginationCommentDto) {
    const page = parseInt(paginationDto.page || '1');
    const pageSize = parseInt(paginationDto.pageSize || '10');
    const keyword = paginationDto.keyword || '';
    return this.commentService.findAllWithPagination({
      page,
      pageSize,
      keyword,
    });
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Get('LayTatCaBinhLuan')
  findAll() {
    return this.commentService.findAll();
  }
  // --- API LẤY BÌNH LUẬN THEO MÃ PHÒNG ---
  @Public()
  @Get('LayBinhLuanTheoPhong/:idPhong')
  findAllByRoom(@Param('idPhong', ParseIntPipe) idPhong: number) {
    return this.commentService.findAllByRoom(idPhong);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Get('TimKiemBinhLuan')
  @ApiQuery({
    name: 'keyword',
    required: true,
    description: 'Từ khóa nội dung bình luận cần tìm',
  })
  search(@Query('keyword') keyword: string) {
    return this.commentService.search(keyword);
  }
  // --- CÁC API CRUD CƠ BẢN ---
  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Post('ThemBinhLuan')
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentService.create(createCommentDto, req.user.id);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Put('CapNhatBinhLuan/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentService.update(
      id,
      updateCommentDto,
      req.user.id,
      req.user.role,
    );
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Delete('XoaBinhLuan/:id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.commentService.remove(id, req.user.id, req.user.role);
  }
}
