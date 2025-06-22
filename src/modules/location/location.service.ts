import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaClient) {}

  async create(createLocationDto: CreateLocationDto) {
    const { ten_vi_tri, tinh_thanh } = createLocationDto;

    const existingLocation = await this.prisma.viTri.findFirst({
      where: {
        ten_vi_tri: { equals: ten_vi_tri },
        tinh_thanh: { equals: tinh_thanh },
      },
    });

    if (existingLocation) {
      throw new ConflictException(
        `Vị trí '${ten_vi_tri}' tại '${tinh_thanh}' đã tồn tại.`,
      );
    }

    return this.prisma.viTri.create({ data: createLocationDto });
  }

  findAll() {
    return this.prisma.viTri.findMany();
  }

  async findWithPagination(paginationDto: {
    page: number;
    pageSize: number;
    keyword: string;
  }) {
    const { page, pageSize, keyword } = paginationDto;
    const skip = (page - 1) * pageSize;

    const whereCondition = keyword
      ? {
          ten_vi_tri: {
            contains: keyword,
          },
        }
      : {};

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.viTri.count({ where: whereCondition }),
      this.prisma.viTri.findMany({
        where: whereCondition,
        skip: skip,
        take: pageSize,
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

  async findOne(id: number) {
    const location = await this.prisma.viTri.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Vị trí với ID ${id} không tồn tại.`);
    }
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    await this.findOne(id);
    return this.prisma.viTri.update({
      where: { id: id },
      data: updateLocationDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.viTri.delete({ where: { id } });
    return { message: `Đã xóa thành công vị trí ID ${id}` };
  }

  async uploadImage(id: number, fileName: string) {
    if (!fileName) {
      throw new BadRequestException('Không có file được upload');
    }
    const location = await this.findOne(id);
    if (!location) {
      throw new BadRequestException(`Vị trí với ID ${id} không tồn tại`);
    }
    if (location.hinh_anh) {
      const oldImagePath = path.join(
        './',
        'public/img',
        'locations',
        location.hinh_anh,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    return this.prisma.viTri.update({
      where: { id },
      data: { hinh_anh: fileName },
    });
  }

  async search(keyword: string) {
    if (!keyword) {
      return [];
    }
    return this.prisma.viTri.findMany({
      where: {
        ten_vi_tri: {
          contains: keyword,
        },
      },
    });
  }
}
