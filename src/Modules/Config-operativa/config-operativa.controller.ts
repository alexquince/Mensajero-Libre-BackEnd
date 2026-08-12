import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';
import { ConfigOperativaService } from './config-operativa.service';
import { CreateConfigOperativaDto } from './dto/create-config-operativa.dto';
import { UpdateConfigOperativaDto } from './dto/update-config-operativa.dto';

@Controller('config-operativa')
export class ConfigOperativaController {
  constructor(
    private readonly configOperativaService: ConfigOperativaService,
  ) {}

  @Post()
  create(
    @Body()
    createConfigOperativaDto: CreateConfigOperativaDto,
  ) {
    return this.configOperativaService.create(
      createConfigOperativaDto,
    );
  }

  @Get()
  findAll() {
    return this.configOperativaService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.configOperativaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateConfigOperativaDto: UpdateConfigOperativaDto,
  ) {
    return this.configOperativaService.update(
      id,
      updateConfigOperativaDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.configOperativaService.remove(id);
  }
}