import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [LocationController],
  providers: [LocationService, PrismaClient],
})
export class LocationModule {}
