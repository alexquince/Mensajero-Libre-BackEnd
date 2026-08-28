import {Controller,Get,Post,Body,Patch,Delete,Param,Query,ParseUUIDPipe,} from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Controller('calificaciones')
export class CalificacionController {
  constructor(
    private readonly calificacionService: CalificacionService,
  ) {}

  @Post()
  create(@Body() dto: CreateCalificacionDto) {
    return this.calificacionService.create(dto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('mensajero_id') mensajero_id?: string,
    @Query('cliente_id') cliente_id?: string,
  ) {
    return this.calificacionService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where: {
        ...(mensajero_id && { mensajero_id }),
        ...(cliente_id && { cliente_id }),
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.calificacionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCalificacionDto,
  ) {
    return this.calificacionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.calificacionService.remove(id);
  }
}