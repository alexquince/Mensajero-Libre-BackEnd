import {Controller,Get,Post,Patch,Delete,Body,Param,Query,ParseUUIDPipe,} from '@nestjs/common';
import { MetricaMensajeroService } from './metrica-mensajero.service';
import { CreateMetricaMensajeroDto } from './dto/create-metrica-mensajero.dto';
import { UpdateMetricaMensajeroDto } from './dto/update-metrica-mensajero.dto';

@Controller('metricas-mensajero')
export class MetricaMensajeroController {
  constructor(
    private readonly metricaMensajeroService: MetricaMensajeroService,
  ) {}

  @Post()
  create(@Body() dto: CreateMetricaMensajeroDto) {
    return this.metricaMensajeroService.create(dto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('mensajero_id') mensajero_id?: string,
  ) {
    return this.metricaMensajeroService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      mensajero_id,
      orderBy: {
        score: 'desc',
      },
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.metricaMensajeroService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMetricaMensajeroDto,
  ) {
    return this.metricaMensajeroService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.metricaMensajeroService.remove(id);
  }
}