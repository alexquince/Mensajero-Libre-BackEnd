import {BadRequestException,Body,Controller,Delete,Get,Param,Patch,Post,Req,} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UbicacionesService } from './ubicaciones.service';
import type { AuthenticatedUser } from './ubicaciones.service';

import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { Roles } from '../Auth/decorators/roles.decorator';

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

const MAX_POSTGRES_BIGINT = 9223372036854775807n;

function parseUbicacionId(value: string): bigint {
  if (!/^[1-9]\d*$/.test(value)) {
    throw new BadRequestException(
      'El ID de la ubicación debe ser un entero positivo.',
    );
  }

  const id = BigInt(value);

  if (id > MAX_POSTGRES_BIGINT) {
    throw new BadRequestException(
      'El ID de la ubicación está fuera del rango permitido.',
    );
  }

  return id;
}

@ApiBearerAuth('access-token')
@Roles('admin', 'mensajero')
@Controller('ubicaciones')
export class UbicacionesController {
  constructor(
    private readonly ubicacionesService: UbicacionesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateUbicacionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ubicacionesService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.ubicacionesService.findAll(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ubicacionesService.findOne(
      parseUbicacionId(id),
      req.user,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUbicacionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ubicacionesService.update(
      parseUbicacionId(id),
      dto,
      req.user,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ubicacionesService.remove(
      parseUbicacionId(id),
      req.user,
    );
  }
}
