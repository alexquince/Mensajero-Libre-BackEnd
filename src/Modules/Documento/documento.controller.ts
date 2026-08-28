import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Patch,Param,ParseUUIDPipe,Post,} from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Controller('documentos')
export class DocumentoController {
  constructor(
    private readonly documentoService: DocumentoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDocumentoDto) {
    return this.documentoService.create(dto);
  }
  @Get()
  findAll() {
  return this.documentoService.findAll();
}
@Get(':id')
findOne(
  @Param('id', ParseUUIDPipe) id: string,
) {
  return this.documentoService.findOne(id);
}
@Patch(':id')
update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: UpdateDocumentoDto,
) {
  return this.documentoService.update(id, dto);
}
@Delete(':id')
remove(
  @Param('id', ParseUUIDPipe) id: string,
) {
  return this.documentoService.remove(id);
}
}