import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination-user.dto';
import { AdduserDto } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllUser() {
    const users = await this.prismaService.nguoiDung.findMany();
    return {
      status: 'success',
      message: 'Lấy danh sách người dùng thành công',
      data: users,
    };
  }
  async getAllUserPagination(paginationDto: PaginationDto) {
    let { page, pageSize, search } = paginationDto;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 3;
    search = search || ``;
    const skip = (page - 1) * pageSize;
    const where = { name: { contains: search } };
    const users = await this.prismaService.nguoiDung.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      where: where,
    });
    if (!users.length) {
      throw new BadRequestException('Không tìm thấy người dùng nào');
    }
    const totalItem = await this.prismaService.nguoiDung.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);
    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: users || [],
    };
  }
  async searchUser(name: string) {
    const where = { name: { contains: name } };
    const user = await this.prismaService.nguoiDung.findMany({
      where: where,
    });
    if (!user.length) {
      throw new BadRequestException('Không tìm thấy người dùng nào');
    }
    return {
      status: 'success',
      message: `Lấy danh sách người dùng với tài khoản ${name} thành công`,
      data: user,
    };
  }
  async addUser(body: AdduserDto) {
    const { name, email, pass_word, phone, birth_day, gender, role } = body;
    const existingUser = await this.prismaService.nguoiDung.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const hashedPassword = await bcrypt.hash(pass_word, 10);
    const newUser = await this.prismaService.nguoiDung.create({
      data: {
        name,
        email,
        pass_word: hashedPassword,
        phone,
        birth_day: birth_day ? new Date(birth_day) : undefined,
        gender,
        role: role || 'guest',
      },
    });
    const { pass_word: _, ...userWithoutPassword } = newUser;
    return {
      message: 'Thêm người dùng thành công',
      ...userWithoutPassword,
    };
  }
  async deleteUser(email: string) {
    const user = await this.prismaService.nguoiDung.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    await this.prismaService.nguoiDung.delete({
      where: { email },
    });
    return {
      message: 'Xóa người dùng thành công',
      ...user,
    };
  }
  async updateUser(id: number, body: UpdateUserDto) {
    const existingUser = await this.prismaService.nguoiDung.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await this.prismaService.nguoiDung.findUnique({
        where: { email: body.email },
      });
      if (emailExists) {
        throw new BadRequestException('Email đã được sử dụng');
      }
    }
    let hashedPassword: string | undefined;
    if (body.pass_word) {
      const bcrypt = await import('bcrypt');
      hashedPassword = await bcrypt.hash(body.pass_word, 10);
    }

    const dataToUpdate: any = {
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email }),
      ...(body.phone && { phone: body.phone }),
      ...(body.birth_day && { birth_day: new Date(body.birth_day) }),
      ...(body.gender && { gender: body.gender }),
      ...(body.role && { role: body.role }),
      ...(hashedPassword && { pass_word: hashedPassword }),
    };

    const updatedUser = await this.prismaService.nguoiDung.update({
      where: { id },
      data: dataToUpdate,
    });

    const { pass_word, ...userWithoutPassword } = updatedUser;

    return {
      message: 'Cập nhật người dùng thành công',
      ...userWithoutPassword,
    };
  }
  async getUserInfo(email: string) {
    const user = await this.prismaService.nguoiDung.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    return {
      message: 'Lấy thông tin người dùng thành công',
      ...user,
    };
  }
  async getAllUserType() {
    const userTypes = await this.prismaService.nguoiDung.findMany({
      where: {
        role: {
          not: null,
        },
      },
      distinct: ['role'],
      select: {
        role: true,
      },
    });
    if (!userTypes.length) {
      throw new BadRequestException('Không tìm thấy loại người dùng nào');
    }
    return userTypes.map((item) => item.role);
  }
}
