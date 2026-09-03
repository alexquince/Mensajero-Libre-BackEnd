import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,ParseUUIDPipe,Patch,Post,Query,Req,UnauthorizedException,} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiQuery,ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { rol_usuario, estado_usuario } from '@prisma/client';
import { Roles } from '../Auth/decorators/roles.decorator';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create.usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuarios')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
@Roles('admin')
@Controller('usuarios')
@Roles('admin')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
    create(
    @Req() req: Request,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    const user = (req as any).user;

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no autenticado. Debe iniciar sesión.',
      );
    }

    return this.usuarioService.create(user.id, createUsuarioDto);
  }

  @ApiQuery({ name: 'skip', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: rol_usuario })
  @ApiQuery({ name: 'estado', required: false, enum: estado_usuario })
  @ApiQuery({ name: 'search', required: false, type: String }) 
  @Get()
  
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('role') role?: rol_usuario,
    @Query('estado') estado?: estado_usuario,
    @Query('search') search?: string,
  ) {
    return this.usuarioService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where: {
        ...(role && { role }),
        ...(estado && { estado }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
    update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.remove(id);
  }
}