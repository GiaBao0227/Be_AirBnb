import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaClient, JwtService],
})
export class CommentModule {}
