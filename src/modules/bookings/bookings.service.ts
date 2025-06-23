import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const booking = await this.prismaService.datPhong.findMany({
      orderBy: { createdAt: 'desc' },
      where: { isDeleted: false },
    });

    return {
      ...(booking === null && {
        message: `Không tìm thấy thông tin đặt phòng`,
      }),
      items: booking,
    };
  }

  async findByUser(userId: number) {
    const booking = await this.prismaService.datPhong.findMany({
      orderBy: { createdAt: 'desc' },
      where: { ma_nguoi_dat: userId, isDeleted: false },
    });

    return {
      ...(booking === null && {
        message: `Không tìm thấy thông tin đặt phòng`,
      }),
      items: booking,
    };
  }

  async findPaginate(paginationDto: PaginationQueryDto) {
    let { page, pageSize, search } = paginationDto;
    const skip = (page - 1) * pageSize;
    const where = {
      isDeleted: false,
      Phong: {
        ViTri: {
          tinh_thanh: {
            contains: search,
          },
        },
      },
    };

    const [items, totalItem] = await this.prismaService.$transaction([
      this.prismaService.datPhong.findMany({
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        where: where,
        include: {
          Phong: {
            include: {
              ViTri: true,
            },
          },
        },
      }),
      this.prismaService.datPhong.count({
        where: where,
      }),
    ]);
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page,
      pageSize,
      totalItem,
      totalPage,
      items,
    };
  }

  async search(keyword: string) {
    if (!keyword) {
      return [];
    }
    return this.prismaService.datPhong.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        Phong: {
          ViTri: {
            tinh_thanh: {
              contains: keyword,
            },
          },
        },
      },
      include: {
        Phong: {
          include: {
            ViTri: true,
          },
        },
      },
    });
  }

  async create(createBookingDto: CreateBookingDto) {
    const { ma_phong, so_luong_khach, ngay_den, ngay_di } = createBookingDto;

    const room = await this.prismaService.phong.findFirst({
      where: { id: ma_phong, isDeleted: false },
    });
    if (!room) {
      throw new BadRequestException(`Phòng với ID ${ma_phong} không tồn tại`);
    }
    if (so_luong_khach > room.khach) {
      throw new BadRequestException(
        `Số lượng khách (${so_luong_khach}) vượt quá giới hạn phòng (${room.khach})`,
      );
    }

    const conflict = await this.prismaService.datPhong.findFirst({
      where: {
        ma_phong,
        isDeleted: false,
        OR: [
          {
            ngay_den: { lte: ngay_di },
            ngay_di: { gte: ngay_den },
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException(
        `Phòng đã có người đặt từ ${conflict.ngay_den.toISOString().slice(0, 10)} đến ${conflict.ngay_di.toISOString().slice(0, 10)}`,
      );
    }

    const booking = await this.prismaService.datPhong.create({
      data: createBookingDto,
    });

    return {
      message: 'Đặt phòng thành công',
      items: booking,
    };
  }

  async findOne(id: number) {
    const booking = await this.prismaService.datPhong.findFirst({
      where: { id, isDeleted: false },
      include: {
        Phong: {
          include: {
            ViTri: true,
          },
        },
        NguoiDung: true,
      },
    });

    return {
      ...(booking === null && {
        message: `Không tìm thấy thông tin đặt phòng`,
      }),
      items: booking,
    };
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const existingBooking = await this.prismaService.datPhong.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingBooking) {
      throw new BadRequestException(`Không tìm thấy đặt phòng`);
    }

    const room = await this.prismaService.phong.findFirst({
      where: { id: updateBookingDto.ma_phong, isDeleted: false },
    });
    if (!room)
      throw new BadRequestException(
        `Phòng với ID ${updateBookingDto.ma_phong} không tồn tại`,
      );

    const user = await this.prismaService.nguoiDung.findUnique({
      where: { id: updateBookingDto.ma_nguoi_dat, isDeleted: false },
    });
    if (!user) throw new BadRequestException('Người đặt không tồn tại');

    const booking = await this.prismaService.datPhong.update({
      where: { id },
      data: updateBookingDto,
    });

    return {
      message: 'Cập nhật thông tin đặt phòng thành công',
      items: booking,
    };
  }

  async remove(id: number) {
    const booking = await this.prismaService.datPhong.findFirst({
      where: { id },
    });

    if (!booking || booking.isDeleted) {
      throw new BadRequestException('Đặt phòng không tồn tại');
    }

    await this.prismaService.datPhong.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: `Đã huỷ đặt phòng thành công` };
  }

  async getUserBookingStats(userId: number) {
    const bookings = await this.prismaService.datPhong.findMany({
      where: { ma_nguoi_dat: userId, isDeleted: false },
      select: {
        ma_phong: true,
        Phong: {
          select: {
            gia_tien: true,
          },
        },
      },
    });

    const totalBookings = bookings.length;
    const totalRooms = new Set(bookings.map((b) => b.ma_phong)).size;
    const totalSpent = bookings.reduce(
      (sum, b) => sum + Number(b.Phong.gia_tien),
      0,
    );

    return {
      totalBookings,
      totalRooms,
      totalSpent,
    };
  }
}
