import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from './token.service';
import { RegisterDto } from './dto/register-auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refreshtoken-auth.dto';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async register(body: RegisterDto) {
    try {
      // 1. Kiểm tra email đã tồn tại chưa
      const userExists = await this.prismaService.nguoiDung.findUnique({
        where: {
          email: body.email,
        },
      });

      if (userExists) {
        throw new BadRequestException('Email đã tồn tại, vui lòng đăng nhập.');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      // 3. Tạo user mới
      const newUser = await this.prismaService.nguoiDung.create({
        data: {
          name: body.name,
          email: body.email,
          pass_word: hashedPassword,
          phone: body.phone,
          birth_day: body.birthday ? new Date(body.birthday) : null,
          gender: body.gender,
          role: 'guest',
        },
      });
      const { pass_word, ...userWithoutPassword } = newUser;
      return {
        message: 'Đăng ký thành công',
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('Đăng ký lỗi:', error);
      // Nếu là lỗi unique email
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email đã tồn tại!');
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi máy chủ, vui lòng thử lại sau',
      );
    }
  }
  async login(body: LoginDto) {
    const userExists = await this.prismaService.nguoiDung.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!userExists) {
      throw new BadRequestException(
        'Tài khoản chưa được đăng ký vui lòng đăng ký',
      );
    }
    if (!userExists.pass_word) {
      throw new BadRequestException('Mật khẩu không hợp lệ');
    }
    const isPassword = await bcrypt.compare(
      body.password,
      userExists.pass_word,
    );
    if (!isPassword) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }
    const tokens = this.tokenService.createToken(userExists.id);
    return { ...tokens, user: userExists };
  }
  async getUserInfo(user: any) {
    return user;
  }
  async refreshToken(body: RefreshTokenDto) {
    const { accessToken, refreshToken } = body;
    if (!accessToken) {
      throw new UnauthorizedException('Không có access token');
    }
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }
    let decodeAccessToken;
    let decodeRefreshToken;
    try {
      decodeAccessToken = jwt.verify(
        accessToken,
        ACCESS_TOKEN_SECRET as string,
        { ignoreExpiration: true },
      );
    } catch (error) {
      throw new UnauthorizedException('Access token không hợp lệ');
    }
    try {
      decodeRefreshToken = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET as string,
      );
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (decodeRefreshToken.userId !== decodeAccessToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    const tokens = this.tokenService.createToken(decodeRefreshToken.userId);
    return { message: 'Làm mới token thành công', ...tokens };
  }
}
