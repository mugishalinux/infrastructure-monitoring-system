import { IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InstitutionUpateDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "institution name required",
  })
  institutionName: string;
}
