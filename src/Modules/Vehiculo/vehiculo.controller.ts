import {Body,Controller, Delete, Get, Patch, Param, ParseUUIDPipe, HttpCode,HttpStatus,Post,} from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Controller('vehiculos')
export class VehiculoController {
  constructor(
    private readonly vehiculoService: VehiculoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateVehiculoDto) {
    return this.vehiculoService.create(dto);
  }
  @Get()
findAll() {
  return this.vehiculoService.findAll();
}
@Get(':id')
findOne(
  @Param('id', ParseUUIDPipe)
  id: string,
) {
  return this.vehiculoService.findOne(id);
}
@Patch(':id')
update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: UpdateVehiculoDto,
) {
  return this.vehiculoService.update(id, dto);
}
@Delete(':id')
@HttpCode(HttpStatus.OK)
remove(
  @Param('id', ParseUUIDPipe)
  id: string,
) {
  return this.vehiculoService.remove(id);
}
}