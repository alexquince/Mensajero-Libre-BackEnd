import {Body,Controller,Delete,Get,Patch,Post,Param,} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { Roles } from '../Auth/decorators/roles.decorator';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiTags('Clientes')
@ApiBearerAuth('access-token')
@Controller('clientes')
export class ClienteController {

  constructor(
    private readonly clienteService: ClienteService,
  ) {}

  @Post()
  @Roles('admin')
  create(
    @Body() dto: CreateClienteDto,
  ) {
    return this.clienteService.create(dto);
  }
  @Get()
  @Roles('admin')
  findAll() {
  return this.clienteService.findAll();
  }
  @Get(':id')
  @Roles('admin')
  findOne(
  @Param('id') id: string,
  ) {
  return this.clienteService.findOne(id);
  }
  @Patch(':id')
  @Roles('admin')
  update(
  @Param('id') id: string,
  @Body() dto: UpdateClienteDto,
  ) {
  return this.clienteService.update(id, dto);
  }
  @Delete(':id')
  @Roles('admin')
  remove(
  @Param('id') id: string,
  ) {
  return this.clienteService.remove(id);
  }
}