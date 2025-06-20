import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Booking')
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/')
  @ApiBearerAuth('AccessToken')
  async findAll() {
    return await this.bookingsService.findAll();
  }

  @Get('/by-user/:userId')
  @ApiBearerAuth('AccessToken')
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID người dùng cần lấy danh sách đặt phòng',
  })
  @ApiParam({ name: 'userId', type: Number })
  async findByUser(@Param('userId') userId: string, @Req() req: Request) {
    return await this.bookingsService.findByUser(+userId);
  }

  @Get('/pagination')
  @ApiBearerAuth('AccessToken')
  async findPaginate(@Query() query: PaginationQueryDto) {
    return await this.bookingsService.findPaginate(query);
  }

  @Post('/')
  @ApiBearerAuth('AccessToken')
  @ApiBody({ type: CreateBookingDto })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingsService.create(createBookingDto);
  }

  @Get('/:id')
  @ApiBearerAuth('AccessToken')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  async findOne(@Param('id') id: string) {
    return await this.bookingsService.findOne(+id);
  }

  @Patch('/:id')
  @ApiBearerAuth('AccessToken')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID đặt phòng cần cập nhật',
  })
  @ApiBody({ type: UpdateBookingDto })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return await this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete('/:id')
  @ApiBearerAuth('AccessToken')
  @ApiParam({ name: 'id', type: Number, description: 'ID đặt phòng cần huỷ' })
  async remove(@Param('id') id: string) {
    return await this.bookingsService.remove(+id);
  }
}
