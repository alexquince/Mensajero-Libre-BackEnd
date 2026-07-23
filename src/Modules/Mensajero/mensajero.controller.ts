import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { MensajeroService } from './mensajero.service';
import { CreateMensajeroDto } from './dto/create-mensajero.dto';
import { UpdateMensajeroDto } from './dto/update-mensajero.dto';

@Controller('mensajeros')
export class MensajeroController {
  constructor(
    private readonly mensajeroService: MensajeroService,
  ) {}

  @Post()
  create(@Body() dto: CreateMensajeroDto) {
    return this.mensajeroService.create(dto);
  }
  @Get()
findAll() {
  return this.mensajeroService.findAll();
  }

  @Get(':id')
findOne(
  @Param('id', ParseUUIDPipe) id: string,
) {
  return this.mensajeroService.findOne(id);
}
@Patch(':id')
update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: UpdateMensajeroDto,
) {
  return this.mensajeroService.update(id, dto);
}
@Delete(':id')
remove(
  @Param('id', ParseUUIDPipe) id: string,
) {
  return this.mensajeroService.remove(id);
}
}