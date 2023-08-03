import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ClaimDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide description ",
  })
  description: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide infrastructure images ",
  })
  image: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide institution id",
  })
  institution: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide province id",
  })
  province: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide district id",
  })
  district: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide sector id",
  })
  sector: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide cell id",
  })
  cell: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "please provide village id",
  })
  village: number;
}
