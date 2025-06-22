import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PORT } from 'src/common/constant/app.constant';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const room = await this.prismaService.phong.findMany({
      orderBy: { createdAt: 'desc' },
      where: { isDeleted: false },
    });

    return {
      ...(room === null && {
        message: `Không tìm thấy thông tin phòng`,
      }),
      items: room,
    };
  }

  async findByLocation(locationId: number) {
    const rooms = await this.prismaService.phong.findMany({
      orderBy: { createdAt: 'desc' },
      where: { vi_tri_id: locationId, isDeleted: false },
    });

    return {
      ...(rooms === null && {
        message: `Không tìm thấy thông tin phòng`,
      }),
      items: rooms,
    };
  }

  async findPaginate(paginationDto: PaginationQueryDto) {
    let { page, pageSize, search } = paginationDto;
    const skip = (page - 1) * pageSize;
    const where = { ten_phong: { contains: search }, isDeleted: false };

    const room = await this.prismaService.phong.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      where: where,
      include: {
        ViTri: true,
      },
    });

    const totalItem = await this.prismaService.phong.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: room || [],
    };
  }

  async search(keyword: string) {
    if (!keyword) {
      return [];
    }
    return this.prismaService.phong.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        ten_phong: {
          contains: keyword,
        },
      },
      include: {
        ViTri: true,
      },
    });
  }

  async create(createRoomDto: CreateRoomDto) {
    const { vi_tri_id } = createRoomDto;

    const location = await this.prismaService.viTri.findFirst({
      where: { id: vi_tri_id },
    });

    if (!location) {
      throw new BadRequestException(`Vị trí phòng không tồn tại.`);
    }

    const room = await this.prismaService.phong.create({
      data: createRoomDto,
    });

    return {
      message: 'Tạo phòng thành công',
      items: room,
    };
  }

  async findOne(id: number) {
    const room = await this.prismaService.phong.findFirst({
      where: { id, isDeleted: false },
      include: {
        ViTri: true,
      },
    });

    return {
      ...(room === null && {
        message: `Không tìm thấy thông tin phòng`,
      }),
      items: room,
    };
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const existingRoom = await this.prismaService.phong.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingRoom) {
      throw new BadRequestException(`Không tìm thấy phòng`);
    }

    if (updateRoomDto.vi_tri_id) {
      const location = await this.prismaService.viTri.findFirst({
        where: { id: updateRoomDto.vi_tri_id },
      });

      if (!location) {
        throw new BadRequestException(`Vị trí phòng không tồn tại.`);
      }
    }

    const room = await this.prismaService.phong.update({
      where: { id },
      data: updateRoomDto,
    });

    return {
      message: 'Cập nhật thông tin phòng thành công',
      items: room,
    };
  }

  async remove(id: number) {
    const room = await this.prismaService.phong.findFirst({ where: { id } });

    if (!room || room.isDeleted) {
      throw new BadRequestException('Phòng không tồn tại');
    }

    await this.prismaService.phong.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: `Đã xoá phòng thành công (xóa mềm).` };
  }

  async uploadImage(id: number, file: Express.Multer.File) {
    if (!file || !file.filename) {
      throw new BadRequestException('Không có file được upload');
    }

    const room = await this.prismaService.phong.findFirst({
      where: { id, isDeleted: false },
    });

    if (!room) {
      throw new BadRequestException(`Phòng với ID ${id} không tồn tại`);
    }

    if (room.hinh_anh) {
      const oldFilePath = path.join('./', 'public/img', 'rooms', room.hinh_anh);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await this.prismaService.phong.update({
      where: { id },
      data: { hinh_anh: file.filename },
    });

    return {
      message: 'Upload ảnh phòng thành công',
      filename: file.filename,
      imgUrl: `http://localhost:${PORT}/images/rooms/${file.filename}`,
    };
  }
}
