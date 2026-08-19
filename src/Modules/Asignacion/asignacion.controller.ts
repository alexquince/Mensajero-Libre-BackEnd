import {Controller,Get,Param,ParseUUIDPipe,Query,} from '@nestjs/common';
import { AsignacionService } from './asignacion.service';

@Controller('asignaciones')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.asignacionService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.asignacionService.findOne(id);
  }

  @Get('turno/:turnoId')
  findByTurno(
    @Param('turnoId', ParseUUIDPipe) turnoId: string,
  ) {
    return this.asignacionService.findByTurno(turnoId);
  }

  @Get('admin/:adminId')
  findByAdmin(
    @Param('adminId', ParseUUIDPipe) adminId: string,
  ) {
    return this.asignacionService.findByAdmin(adminId);
  }
}