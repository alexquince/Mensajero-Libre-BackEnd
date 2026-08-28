import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';
import { PuntosMensajeroService } from './puntos-mensajero.service';
import { CreatePuntoMensajeroDto } from './dto/create-punto-mensajero.dto';
import { UpdatePuntoMensajeroDto } from './dto/update-punto-mensajero.dto';

@Controller('puntos-mensajero')
export class PuntosMensajeroController {
  constructor(
    private readonly puntosMensajeroService: PuntosMensajeroService,
  ) {}

  @Post()
  create(
    @Body()
    createPuntoMensajeroDto: CreatePuntoMensajeroDto,
  ) {
    return this.puntosMensajeroService.create(
      createPuntoMensajeroDto,
    );
  }

  @Get()
  findAll() {
    return this.puntosMensajeroService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.puntosMensajeroService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updatePuntoMensajeroDto: UpdatePuntoMensajeroDto,
  ) {
    return this.puntosMensajeroService.update(
      id,
      updatePuntoMensajeroDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.puntosMensajeroService.remove(id);
  }
}