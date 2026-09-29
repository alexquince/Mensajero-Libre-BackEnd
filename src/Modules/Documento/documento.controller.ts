import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,ParseUUIDPipe,Patch,Post,Req,} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DocumentoService } from './documento.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Roles } from '../Auth/decorators/roles.decorator';

@Controller('documentos')
@ApiBearerAuth('access-token')
@Roles('admin', 'mensajero')
export class DocumentoController {
  constructor(
    private readonly documentoService: DocumentoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateDocumentoDto,
    @Req() req: any,
  ) {
    return this.documentoService.create(
      dto,
      req.user,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.documentoService.findAll(
      req.user,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.documentoService.findOne(
      id,
      req.user,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentoDto,
    @Req() req: any,
  ) {
    return this.documentoService.update(
      id,
      dto,
      req.user,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.documentoService.remove(
      id,
      req.user,
    );
  }
}