import { Controller } from '@nestjs/common';
import { DescansoService } from './descanso.service';

@Controller('descansos')
export class DescansoController {
  constructor(private readonly descansoService: DescansoService) {}
}
