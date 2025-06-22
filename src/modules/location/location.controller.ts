import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
  Query,
  Request,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PaginationLocationDto } from './dto/pagination-location.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { ProtectGuard } from 'src/modules/auth/protect/protect.guard';
import { uploadConfig } from 'src/config/upload.config';

@ApiTags('Location')
@Controller('Location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get('LayDanhSachViTri')
  findAll() {
    return this.locationService.findAll();
  }

  @Public()
  @Get('LayDanhSachViTriPhanTrang')
  findWithPagination(@Query() paginationDto: PaginationLocationDto) {
    const page = parseInt(paginationDto.page || '1');
    const pageSize = parseInt(paginationDto.pageSize || '10');
    const keyword = paginationDto.keyword || '';
    return this.locationService.findWithPagination({ page, pageSize, keyword });
  }

  @Public()
  @Get('LayThongTinViTri/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Public()
  @Get('TimKiemViTri')
  @ApiQuery({
    name: 'keyword',
    required: true,
    description: 'Từ khóa tên vị trí cần tìm',
  })
  searchLocation(@Query('keyword') keyword: string) {
    return this.locationService.search(keyword);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Post('ThemViTri')
  create(@Body() createLocationDto: CreateLocationDto, @Request() req) {
    if (req.user.role !== 'admin')
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này.',
      );
    return this.locationService.create(createLocationDto);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Put('CapNhatThongTinViTri/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
    @Request() req,
  ) {
    if (req.user.role !== 'admin')
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này.',
      );
    return this.locationService.update(id, updateLocationDto);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @Delete('XoaViTri/:id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.role !== 'admin')
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này.',
      );
    return this.locationService.remove(id);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(ProtectGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @Post('UploadHinhAnhViTri')
  @ApiQuery({
    name: 'maViTri',
    required: true,
    description: 'ID của vị trí cần upload ảnh',
  })
  @UseInterceptors(uploadConfig('locations', 2))
  uploadImage(
    @Query('maViTri', ParseIntPipe) maViTri: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (req.user.role !== 'admin')
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này.',
      );
    if (!file || !file.filename) {
      throw new BadRequestException('Không có file được upload');
    }
    return this.locationService.uploadImage(maViTri, file.filename);
  }
}
