import {Controller,Get,Post,Body,Patch,Param,Delete,Query,ParseUUIDPipe,} from '@nestjs/common';
import { IncidenteService } from './incidente.service';
import { CreateIncidenteDto } from './dto/create-incidente.dto';
import { UpdateIncidenteDto } from './dto/update-incidente.dto';
import { nivel_incidente, tipo_incidente } from '@prisma/client';

@Controller('incidentes')
export class IncidenteController {
  constructor(private readonly incidenteService: IncidenteService) {}

  @Post()
  create(@Body() createIncidenteDto: CreateIncidenteDto) {
    return this.incidenteService.create(createIncidenteDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('nivel') nivel?: nivel_incidente,
    @Query('tipo') tipo?: tipo_incidente,
  ) {
    return this.incidenteService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where: {
        ...(nivel && { nivel }),
        ...(tipo && { tipo }),
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidenteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncidenteDto: UpdateIncidenteDto,
  ) {
    return this.incidenteService.update(id, updateIncidenteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidenteService.remove(id);
  }
}