import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma, estado_descanso, mensajeros } from '@prisma/client';
import { CreateDescansoDto } from './dto/create-descanso.dto'
import { UpdateDescansoDto } from './dto/update-descanso.dto' 