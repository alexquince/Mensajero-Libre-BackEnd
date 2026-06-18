import { IsUUID, IsDate } from "class-validator";

export class CreateDescansoDto{
    @IsUUID()
    mensajero_id!: string;
    @IsDate()
    fecha!: Date;
         
}