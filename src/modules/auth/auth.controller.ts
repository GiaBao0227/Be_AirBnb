import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorator/public.decorator';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refreshtoken-auth.dto';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('DangKy')
  async register(
    @Body()
    body: RegisterDto,
  ) {
    return this.authService.register(body);
  }
  @Public()
  @Post('DangNhap')
  async login(
    @Body()
    body: LoginDto,
  ) {
    return this.authService.login(body);
  }
  @Get('LayThongTinNguoiDungDangNhap')
  @ApiBearerAuth('AccessToken')
  async getUserInfo(
    @Request()
    req: any,
  ) {
    return this.authService.getUserInfo(req.user);
  }
  @Public()
  @Post('RefreshToken')
  async refreshToken(
    @Body()
    body: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(body);
  }
}
