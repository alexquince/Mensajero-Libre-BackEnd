import { Body,Controller,Delete,Get,Patch,Param,Post } from '@nestjs/common';
import { TarifaService } from './tarifa.service';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';

@Controller('tarifas')
export class TarifaController {
  constructor(
    private readonly tarifaService: TarifaService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateTarifaDto,
  ) {
    return this.tarifaService.create(dto);
  }
  @Get()
findAll() {
  return this.tarifaService.findAll();
}
@Get(':id')
findOne(
  @Param('id') id: string,
) {
  return this.tarifaService.findOne(id);
}
@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateTarifaDto,
) {
  return this.tarifaService.update(id, dto);
}
@Delete(':id')
remove(
  @Param('id') id: string,
) {
  return this.tarifaService.remove(id);
}
}