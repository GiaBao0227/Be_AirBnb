import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { uploadConfig } from 'src/config/upload.config';
import { UploadFileDto } from '../../common/dto/upload-file.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('Room')
@Controller('api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  private checkAdmin(req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Yêu cầu quyền Admin để thực hiện hành động này.',
      );
    }
  }

  @Public()
  @Get('/')
  async findAll() {
    return await this.roomsService.findAll();
  }

  @Public()
  @Get('by-location/:locationId')
  @ApiParam({
    name: 'locationId',
    type: Number,
    description: 'ID của vị trí để lấy danh sách phòng',
  })
  async findRoomsByLocation(@Param('locationId') locationId: string) {
    return await this.roomsService.findByLocation(+locationId);
  }

  @Public()
  @Get('/pagination')
  async findPaginate(@Query() query: PaginationQueryDto) {
    return await this.roomsService.findPaginate(query);
  }

  @Public()
  @Get('/search')
  async search(@Query('keyword') keyword: string) {
    return await this.roomsService.search(keyword);
  }

  @Post('/')
  @ApiBearerAuth('AccessToken')
  @ApiBody({ type: CreateRoomDto })
  async create(@Body() createRoomDto: CreateRoomDto, @Req() req: any) {
    this.checkAdmin(req);
    return await this.roomsService.create(createRoomDto);
  }

  @Public()
  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  async findOne(@Param('id') id: string) {
    return await this.roomsService.findOne(+id);
  }

  @Patch('/:id')
  @ApiBearerAuth('AccessToken')
  @ApiParam({ name: 'id', type: Number, description: 'ID phòng cần cập nhật' })
  @ApiBody({ type: UpdateRoomDto })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Req() req: any,
  ) {
    this.checkAdmin(req);
    return await this.roomsService.update(+id, updateRoomDto);
  }

  @Delete('/:id')
  @ApiBearerAuth('AccessToken')
  @ApiParam({ name: 'id', type: Number, description: 'ID phòng cần xóa' })
  async remove(@Param('id') id: string, @Req() req: any) {
    this.checkAdmin(req);
    return await this.roomsService.remove(+id);
  }

  @Post('/:id/upload-image')
  @ApiBearerAuth('AccessToken')
  @UseInterceptors(uploadConfig('rooms', 2))
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID phòng cần upload ảnh',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    type: UploadFileDto,
  })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    this.checkAdmin(req);
    return await this.roomsService.uploadImage(+id, file);
  }
}
