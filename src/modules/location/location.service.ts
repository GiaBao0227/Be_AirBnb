// src/modules/location/location.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Tạo một vị trí mới sau khi kiểm tra trùng lặp.
   * @param createLocationDto Dữ liệu để tạo vị trí mới.
   * @returns Vị trí vừa được tạo.
   * @throws {ConflictException} Nếu vị trí đã tồn tại.
   */
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

  /**
   * Lấy danh sách tất cả các vị trí.
   * @returns Một mảng các vị trí.
   */
  findAll() {
    return this.prisma.viTri.findMany();
  }

  /**
   * Lấy danh sách vị trí theo phân trang và tìm kiếm.
   * @param paginationDto Chứa thông tin page, pageSize, và keyword.
   * @returns Một object chứa thông tin phân trang và danh sách các vị trí.
   */
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

    // Thực hiện 2 truy vấn song song để tối ưu hiệu năng
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

  /**
   * Lấy thông tin chi tiết của một vị trí theo ID.
   * @param id ID của vị trí cần tìm.
   * @returns Thông tin chi tiết của vị trí.
   * @throws {NotFoundException} Nếu không tìm thấy vị trí.
   */
  async findOne(id: number) {
    const location = await this.prisma.viTri.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Vị trí với ID ${id} không tồn tại.`);
    }
    return location;
  }

  /**
   * Cập nhật thông tin một vị trí.
   * @param id ID của vị trí cần cập nhật.
   * @param updateLocationDto Dữ liệu cần cập nhật.
   * @returns Vị trí đã được cập nhật.
   */
  async update(id: number, updateLocationDto: UpdateLocationDto) {
    await this.findOne(id); // Kiểm tra sự tồn tại trước
    return this.prisma.viTri.update({
      where: { id: id },
      data: updateLocationDto,
    });
  }

  /**
   * Xóa một vị trí.
   * @param id ID của vị trí cần xóa.
   * @returns Một thông báo xác nhận đã xóa.
   */
  async remove(id: number) {
    await this.findOne(id); // Kiểm tra sự tồn tại trước
    await this.prisma.viTri.delete({ where: { id } });
    return { message: `Đã xóa thành công vị trí ID ${id}` };
  }

  /**
   * Cập nhật hình ảnh cho một vị trí.
   * @param id ID của vị trí cần cập nhật ảnh.
   * @param fileName Tên file ảnh đã được upload.
   * @returns Vị trí đã được cập nhật thông tin ảnh.
   */
  async uploadImage(id: number, fileName: string) {
    await this.findOne(id); // Kiểm tra sự tồn tại trước
    return this.prisma.viTri.update({
      where: { id: id },
      data: { hinh_anh: fileName },
    });
  }

  async search(keyword: string) {
    // Nếu không có keyword, trả về mảng rỗng hoặc tất cả (tùy logic bạn muốn)
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
