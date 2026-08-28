import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Controller('ubicaciones')
export class UbicacionesController {
  constructor(
    private readonly ubicacionesService: UbicacionesService,
  ) {}

  @Post()
  create(
    @Body()
    createUbicacionDto: CreateUbicacionDto,
  ) {
    return this.ubicacionesService.create(
      createUbicacionDto,
    );
  }

  @Get()
  findAll() {
    return this.ubicacionesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.ubicacionesService.findOne(
      BigInt(id),
    );
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateUbicacionDto: UpdateUbicacionDto,
  ) {
    return this.ubicacionesService.update(
      BigInt(id),
      updateUbicacionDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.ubicacionesService.remove(
      BigInt(id),
    );
  }
}