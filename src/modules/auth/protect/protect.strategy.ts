import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ProtectStrategy extends PassportStrategy(Strategy, 'protect') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET || 'fallback_secret_key',
    });
  }

  async validate(payload: { id: number; role: string }) {
    const user = await this.prismaService.nguoiDung.findUnique({
      where: { id: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException(`Người dùng không tồn tại.`);
    }
    // Trả về toàn bộ thông tin user (bao gồm cả role) để Guard có thể sử dụng
    return user;
  }
}
