import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsIn(['cliente', 'mensajero'])
  role!: 'cliente' | 'mensajero';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre_empresa?: string;
}
