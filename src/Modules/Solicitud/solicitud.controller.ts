import {Body,Controller,Delete,Get,Param,Patch,Post } from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import {UpdateSolicitudDto} from './dto/update-solicitud.dto';

@Controller('solicitudes')
export class SolicitudController {

  constructor(
    private readonly solicitudService: SolicitudService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateSolicitudDto,
  ) {
    return this.solicitudService.create(dto);
  }
  @Get()
  findAll() {
    return this.solicitudService.findAll();
  }
  @Get(':id')
findOne(
  @Param('id') id: string,
) {
  return this.solicitudService.findOne(id);
}
@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateSolicitudDto,
) {
  return this.solicitudService.update(id, dto);
}
@Delete(':id')
remove(
  @Param('id') id: string,
) {
  return this.solicitudService.remove(id);
}
}