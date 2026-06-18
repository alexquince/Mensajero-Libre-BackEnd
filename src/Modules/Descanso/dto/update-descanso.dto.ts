import { PartialType } from "@nestjs/mapped-types";
import { CreateDescansoDto } from "./create-descanso.dto";
import { IsOptional, IsEnum, IsNumber} from 'class-validator';
import { estado_descanso } from "@prisma/client";


export class UpdateDescansoDto extends PartialType(CreateDescansoDto){
    @IsOptional()
    @IsEnum(estado_descanso)
    estado?: estado_descanso;

    @IsOptional()
    @IsNumber()
    aprobado_por?: string; 

}