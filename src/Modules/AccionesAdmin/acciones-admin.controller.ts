import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';
import { AccionesAdminService } from './acciones-admin.service';
import { CreateAccionesAdminDto } from './dto/create-acciones-admin.dto';
import { UpdateAccionesAdminDto } from './dto/update-acciones-admin.dto';

@Controller('acciones-admin')
export class AccionesAdminController {
  constructor(
    private readonly accionesAdminService: AccionesAdminService,
  ) {}

  @Post()
  create(
    @Body()
    createAccionesAdminDto: CreateAccionesAdminDto,
  ) {
    return this.accionesAdminService.create(
      createAccionesAdminDto,
    );
  }

  @Get()
  findAll() {
    return this.accionesAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accionesAdminService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateAccionesAdminDto: UpdateAccionesAdminDto,
  ) {
    return this.accionesAdminService.update(
      id,
      updateAccionesAdminDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accionesAdminService.remove(id);
  }
}