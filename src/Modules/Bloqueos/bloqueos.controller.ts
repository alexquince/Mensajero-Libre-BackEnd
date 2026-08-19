import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';
import { BloqueosService } from './bloqueos.service';
import { CreateBloqueoDto } from './dto/create-bloqueo.dto';
import { UpdateBloqueoDto } from './dto/update-bloqueo.dto';

@Controller('bloqueos')
export class BloqueosController {
  constructor(
    private readonly bloqueosService: BloqueosService,
  ) {}

  @Post()
  create(
    @Body()
    createBloqueoDto: CreateBloqueoDto,
  ) {
    return this.bloqueosService.create(
      createBloqueoDto,
    );
  }

  @Get()
  findAll() {
    return this.bloqueosService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.bloqueosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateBloqueoDto: UpdateBloqueoDto,
  ) {
    return this.bloqueosService.update(
      id,
      updateBloqueoDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.bloqueosService.remove(id);
  }
}