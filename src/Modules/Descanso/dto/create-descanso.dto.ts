import { IsUUID, IsDate, IsDateString, IsOptional, IsString } from "class-validator";

export class CreateDescansoDto{
    @IsUUID()
    mensajero_id!: string;
    @IsDateString()
    fecha!: string;

    @IsOptional()
    @IsString()
    tipo?: string;

         
}