import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';
import { ValidacionesDocumentosService } from './validaciones-documentos.service';
import { CreateValidacionesDocumentosDto } from './dto/create-validaciones-documentos.dto';
import { UpdateValidacionesDocumentosDto } from './dto/update-validaciones-documentos.dto';

@Controller('validaciones-documentos')
export class ValidacionesDocumentosController {
  constructor(
    private readonly validacionesDocumentosService: ValidacionesDocumentosService,
  ) {}

  @Post()
  create(
    @Body()
    createValidacionesDocumentosDto: CreateValidacionesDocumentosDto,
  ) {
    return this.validacionesDocumentosService.create(
      createValidacionesDocumentosDto,
    );
  }

  @Get()
  findAll() {
    return this.validacionesDocumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.validacionesDocumentosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateValidacionesDocumentosDto: UpdateValidacionesDocumentosDto,
  ) {
    return this.validacionesDocumentosService.update(
      id,
      updateValidacionesDocumentosDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.validacionesDocumentosService.remove(id);
  }
}