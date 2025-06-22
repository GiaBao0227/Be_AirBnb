import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
} from 'src/common/constant/app.constant';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenService],
  exports: [JwtModule],
})
export class AuthModule {}
