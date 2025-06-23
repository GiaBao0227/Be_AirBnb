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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Booking')
@ApiBearerAuth('AccessToken')
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/')
  async findAll() {
    return await this.bookingsService.findAll();
  }

  @Get('/by-user/:userId')
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID người dùng cần lấy danh sách đặt phòng',
  })
  @ApiParam({ name: 'userId', type: Number })
  async findByUser(@Param('userId') userId: string, @Req() req: Request) {
    return await this.bookingsService.findByUser(+userId);
  }

  @Get('/my-history')
  async findMyHistory(@Req() req: any) {
    return await this.bookingsService.findByUser(+req.user.id);
  }

  @Get('/pagination')
  async findPaginate(@Query() query: PaginationQueryDto) {
    return await this.bookingsService.findPaginate(query);
  }

  @Get('/search')
  async search(@Query('keyword') keyword: string) {
    return await this.bookingsService.search(keyword);
  }

  @Post('/')
  @ApiBody({ type: CreateBookingDto })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingsService.create(createBookingDto);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  async findOne(@Param('id') id: string) {
    return await this.bookingsService.findOne(+id);
  }

  @Patch('/:id')
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
  @ApiParam({ name: 'id', type: Number, description: 'ID đặt phòng cần huỷ' })
  async remove(@Param('id') id: string) {
    return await this.bookingsService.remove(+id);
  }

  @Get('stats/user')
  @ApiOperation({ summary: 'Thống kê booking của người dùng hiện tại' })
  async getUserBookingStats(@Req() req: any) {
    return this.bookingsService.getUserBookingStats(req.user.id);
  }
}
