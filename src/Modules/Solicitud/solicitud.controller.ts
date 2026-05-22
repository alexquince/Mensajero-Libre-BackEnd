import { Controller } from '@nestjs/common';
import { SolicitudService } from './solicitud.service';

@Controller('solicitudes')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}
}
