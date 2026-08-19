import {IsUUID,IsString,IsOptional,IsDateString,
} from 'class-validator';

export class CreateSesionDto {
  @IsUUID()
  user_id!: string;

  @IsString()
  refresh_token!: string;

  @IsOptional()
  @IsString()
  dispositivo?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsDateString()
  expiracion!: Date;
}