import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,ParseUUIDPipe,Patch,Post,Query,Req,UnauthorizedException,} from '@nestjs/common';
import type { Request } from 'express';
import { rol_usuario, estado_usuario } from '@prisma/client';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create.usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @Roles('admin')
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

  @Get()
  // @Roles('admin')
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
  // @Roles('admin')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  // @Roles('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.remove(id);
  }
}