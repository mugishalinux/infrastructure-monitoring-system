import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ClaimResponseFormatDto {
  id:number;
  description: string;
  images:string;
  isResolved:boolean;
  institution: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}
