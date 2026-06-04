import { IsNumber, Min, Max } from "class-validator";

export class CheckInDto {
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitud!: number;

    @IsNumber()
    @Min(-180)
    @Max (180)
    longitud!: number;
}