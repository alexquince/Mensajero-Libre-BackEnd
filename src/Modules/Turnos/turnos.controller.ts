// src/turnos/turnos.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards, Req,
} from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create.turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { CheckInDto } from './dto/checkin-turno.dto';
import { estado_turno } from '@prisma/client';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Req() req: any, @Body() createTurnoDto: CreateTurnoDto) {
    const adminId = req.user?.id || 'admin-fijo'; //
    return this.turnosService.create(adminId, createTurnoDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('estado') estado?: estado_turno,
  ) {
    return this.turnosService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where: estado ? { estado } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.turnosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.turnosService.remove(id);
  }

  @Post(':id/checkin')
  checkIn(@Param('id', ParseUUIDPipe) id: string, @Body() checkInDto: CheckInDto) {
    return this.turnosService.checkIn(id, checkInDto.latitud, checkInDto.longitud);
  }

  @Post(':id/checkout')
  checkOut(@Param('id', ParseUUIDPipe) id: string, @Body() checkOutDto: CheckInDto) {
    return this.turnosService.checkOut(id, checkOutDto.latitud, checkOutDto.longitud);
  }
}