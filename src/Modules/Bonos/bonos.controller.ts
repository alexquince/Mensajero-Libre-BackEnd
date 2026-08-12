import {Body,Controller,Delete,Get,Param,Patch,Post,} from '@nestjs/common';
import { BonosService } from './bonos.service';
import { CreateBonoDto } from './dto/create-bono.dto';
import { UpdateBonoDto } from './dto/update-bono.dto';

@Controller('bonos')
export class BonosController {
  constructor(
    private readonly bonosService: BonosService,
  ) {}

  @Post()
  create(
    @Body()
    createBonoDto: CreateBonoDto,
  ) {
    return this.bonosService.create(
      createBonoDto,
    );
  }

  @Get()
  findAll() {
    return this.bonosService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.bonosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateBonoDto: UpdateBonoDto,
  ) {
    return this.bonosService.update(
      id,
      updateBonoDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.bonosService.remove(id);
  }
}