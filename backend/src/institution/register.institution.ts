import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class InstitutionRegisterDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "institution name required",
  })
  institutionName: string;
}
