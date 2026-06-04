// src/usuario/usuario.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create.usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { rol_usuario, estado_usuario } from '@prisma/client';

@Controller('usuarios')
// @UseGuards(JwtAuthGuard, RolesGuard) //usar cuando este creado auth...
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  
  @Post()
  //@Roles('admin')
  create(@Req() req: any, @Body() createUsuarioDto: CreateUsuarioDto) {
    // el admin id viene del token JWT en req.user.id
    const adminId = req.user?.id || 'admin-temp-id'; // Reemplazar
    return this.usuarioService.create(adminId, createUsuarioDto);
  }

  // 2. Listar todos los usuarios *filtros*
  @Get()
  // roles admin
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('role') role?: rol_usuario,
    @Query('estado') estado?: estado_usuario,
    @Query('search') search?: string,
  ) {
    return this.usuarioService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where: {
        ...(role && { role }),
        ...(estado && { estado }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { created_at: 'desc' },
    });
  }

  //Obtener un usuario por ID
  @Get(':id')
  // @Roles('admin')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.findOne(id);
  }

  // Actualizar un usuario (solo admin o el propio usuario)
  @Patch(':id')
  // @Roles('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  // Eliminar un usuario *admin*
  @Delete(':id')
  // @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.remove(id);
  }
}