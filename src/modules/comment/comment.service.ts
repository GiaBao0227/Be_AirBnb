// src/modules/comment/comment.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaClient) {}

  async findAllWithPagination(paginationDto: {
    page: number;
    pageSize: number;
    keyword: string;
  }) {
    const { page, pageSize, keyword } = paginationDto;
    const skip = (page - 1) * pageSize;

    const whereCondition = keyword ? { noi_dung: { contains: keyword } } : {};

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.binhLuan.count({ where: whereCondition }),
      this.prisma.binhLuan.findMany({
        where: whereCondition,
        skip: skip,
        take: pageSize,
        include: {
          NguoiDung: { select: { id: true, name: true, avatar: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      currentPage: page,
      itemsPerPage: pageSize,
      totalItems,
      totalPages,
      items,
    };
  }

  findAll() {
    return this.prisma.binhLuan.findMany({
      include: {
        NguoiDung: {
          select: { id: true, name: true },
        },
      },
    });
  }

  findAllByRoom(roomId: number) {
    return this.prisma.binhLuan.findMany({ where: { ma_phong: roomId } });
  }

  async create(dto: CreateCommentDto, userId: number) {
    const existingBooking = await this.prisma.datPhong.findFirst({
      where: {
        ma_phong: dto.ma_phong,
        ma_nguoi_dat: userId,
        isDeleted: false,
      },
    });

    if (!existingBooking) {
      throw new BadRequestException(
        'Bạn chưa đặt phòng này nên không thể bình luận.',
      );
    }

    return await this.prisma.binhLuan.create({
      data: {
        ...dto,
        ma_nguoi_binh_luan: userId,
        ngay_binh_luan: new Date(),
      },
    });
  }

  async update(
    id: number,
    dto: UpdateCommentDto,
    userId: number,
    userRole: string,
  ) {
    const comment = await this.prisma.binhLuan.findUnique({ where: { id } });
    if (!comment)
      throw new NotFoundException(`Bình luận ID ${id} không tồn tại.`);
    if (comment.ma_nguoi_binh_luan !== userId && userRole !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền sửa bình luận này.');
    }
    return this.prisma.binhLuan.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number, userRole: string) {
    const comment = await this.prisma.binhLuan.findUnique({ where: { id } });
    if (!comment)
      throw new NotFoundException(`Bình luận ID ${id} không tồn tại.`);
    if (comment.ma_nguoi_binh_luan !== userId && userRole !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này.');
    }
    await this.prisma.binhLuan.delete({ where: { id } });
    return { message: `Đã xóa thành công bình luận ID ${id}` };
  }

  async search(keyword: string) {
    if (!keyword) {
      return [];
    }
    return this.prisma.binhLuan.findMany({
      where: {
        noi_dung: {
          contains: keyword,
        },
      },
      include: {
        NguoiDung: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
