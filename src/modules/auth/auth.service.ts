// src/modules/auth/auth.service.ts

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
      const userExists = await this.prismaService.nguoiDung.findUnique({
        where: { email: body.email },
      });

      if (userExists) {
        throw new BadRequestException('Email đã tồn tại, vui lòng đăng nhập.');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      const newUser = await this.prismaService.nguoiDung.create({
        data: {
          name: body.name,
          email: body.email,
          pass_word: hashedPassword,
          phone: body.phone,
          birth_day: body.birthday ? new Date(body.birthday) : null,
          gender: body.gender,
          role: 'user', // Mặc định vai trò là 'user'
        },
      });

      // Không trả về mật khẩu
      const { pass_word, ...userWithoutPassword } = newUser;
      return {
        message: 'Đăng ký thành công',
        user: userWithoutPassword,
      };
    } catch (error) {
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
      where: { email: body.email },
    });

    if (!userExists) {
      throw new BadRequestException('Email hoặc mật khẩu không chính xác.');
    }
    if (!userExists.pass_word) {
      throw new BadRequestException(
        'Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu.',
      );
    }

    const isPasswordMatching = await bcrypt.compare(
      body.password,
      userExists.pass_word,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Email hoặc mật khẩu không chính xác.');
    }

    // Tạo token với id và role
    const tokens = this.tokenService.createToken(
      userExists.id,
      userExists.role || 'user',
    );

    // Không trả về mật khẩu
    const { pass_word, ...userWithoutPassword } = userExists;
    return { ...tokens, user: userWithoutPassword };
  }

  async getUserInfo(user: any) {
    // user được lấy từ token (sau khi đi qua ProtectStrategy)
    // nên nó đã là thông tin mới nhất từ database và đã được xác thực
    const { pass_word, ...userInfo } = user;
    return userInfo;
  }

  /**
   * Hàm làm mới token.
   * @param body Chứa accessToken cũ và refreshToken hợp lệ.
   * @returns Một cặp accessToken và refreshToken mới.
   */
  async refreshToken(body: RefreshTokenDto) {
    const { accessToken, refreshToken } = body;
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Yêu cầu thiếu token.');
    }

    let decodedAccessToken;
    let decodedRefreshToken;

    try {
      // Xác thực refreshToken. Nếu không hợp lệ hoặc hết hạn, nó sẽ ném lỗi.
      decodedRefreshToken = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET as string,
      ) as { id: number };
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn.',
      );
    }

    try {
      // Giải mã accessToken cũ mà không cần kiểm tra hạn (để lấy thông tin user)
      decodedAccessToken = jwt.verify(
        accessToken,
        ACCESS_TOKEN_SECRET as string,
        { ignoreExpiration: true },
      ) as { id: number; role: string };
    } catch (error) {
      // Dù bỏ qua hết hạn, vẫn có thể lỗi nếu token bị thay đổi
      throw new UnauthorizedException('Access token không hợp lệ.');
    }

    // Kiểm tra xem ID trong hai token có khớp nhau không
    if (decodedRefreshToken.id !== decodedAccessToken.id) {
      throw new UnauthorizedException('Token không đồng bộ.');
    }

    // Lấy lại thông tin user từ DB để đảm bảo role là mới nhất
    const user = await this.prismaService.nguoiDung.findUnique({
      where: { id: decodedRefreshToken.id },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không còn tồn tại.');
    }

    // Tạo ra một cặp token mới với thông tin mới nhất
    const newTokens = this.tokenService.createToken(
      user.id,
      user.role || 'user',
    );

    return { message: 'Làm mới token thành công', ...newTokens };
  }
}
