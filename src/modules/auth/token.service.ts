import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  // Thêm `role` vào hàm này
  createToken(id: number, role: string) {
    // Payload bây giờ sẽ chứa cả id và role
    const payload = { id, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
      secret: ACCESS_TOKEN_SECRET,
    });

    // Refresh token chỉ cần id
    const refreshToken = this.jwtService.sign(
      { id },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES,
        secret: REFRESH_TOKEN_SECRET,
      },
    );

    return { accessToken, refreshToken };
  }
}
