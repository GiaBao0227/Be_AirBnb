import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProtectStrategy } from './modules/auth/protect/protect.strategy';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, RoomsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ProtectStrategy],
})
export class AppModule {}
