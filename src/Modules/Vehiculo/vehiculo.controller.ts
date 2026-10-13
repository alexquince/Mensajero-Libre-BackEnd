import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,ParseUUIDPipe,Patch,Post,Req,} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Roles } from '../Auth/decorators/roles.decorator';

@Controller('vehiculos')
@ApiBearerAuth('access-token')
@Roles('admin', 'mensajero')
export class VehiculoController {
  constructor(
    private readonly vehiculoService: VehiculoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateVehiculoDto,
    @Req() req: any,
  ) {
    return this.vehiculoService.create(
      dto,
      req.user,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.vehiculoService.findAll(
      req.user,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.vehiculoService.findOne(
      id,
      req.user,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehiculoDto,
    @Req() req: any,
  ) {
    return this.vehiculoService.update(
      id,
      dto,
      req.user,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.vehiculoService.remove(
      id,
      req.user,
    );
  }
}