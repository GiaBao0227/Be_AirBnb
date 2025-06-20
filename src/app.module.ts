import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { ProtectStrategy } from './modules/auth/protect/protect.strategy';
import { UserModule } from './modules/user/user.module';
import { LocationModule } from './modules/location/location.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [AuthModule, UserModule, LocationModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ProtectStrategy],
})
export class AppModule {}
