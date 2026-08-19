import {Body,Controller,Delete,Get,Post,Param,} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Roles } from '../Auth/decorators/roles.decorator';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly clienteService: ClienteService,
  ) {}

  @Post()
  @Roles('admin', 'cliente')
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
@Delete(':id')
@Roles('admin')
remove(
  @Param('id') id: string,
) {
  return this.clienteService.remove(id);
}
}