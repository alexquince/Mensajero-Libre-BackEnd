import {Controller,Get,Post,Body,Patch,Delete,Param,Query,ParseUUIDPipe,Req,} from '@nestjs/common';
import { DescansoService } from './descanso.service';
import { CreateDescansoDto } from './dto/create-descanso.dto';
import { UpdateDescansoDto } from './dto/update-descanso.dto';
import { estado_descanso } from '@prisma/client';

@Controller('descansos')
export class DescansoController {
  constructor(private readonly descansoService: DescansoService) {}

  @Post()
  create(@Body() createDescansoDto: CreateDescansoDto) {
    return this.descansoService.create(createDescansoDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('mensajero_id') mensajero_id?: string,
    @Query('estado') estado?: estado_descanso,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    return this.descansoService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      mensajero_id,
      estado,
      fecha_desde: fecha_desde ? new Date(fecha_desde) : undefined,
      fecha_hasta: fecha_hasta ? new Date(fecha_hasta) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.descansoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
    @Body() updateDescansoDto: UpdateDescansoDto,
  ) {
    const adminId = req.user?.id || 'admin-fijo';
    return this.descansoService.update(id, adminId, updateDescansoDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    const adminId = req.user?.id;
    return this.descansoService.remove(id, adminId);
  }
}
