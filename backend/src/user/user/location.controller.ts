import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  HttpException,
  HttpStatus,
  ConsoleLogger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../../auth/auth.service";
import { Not } from "typeorm";
import { LocationService } from "./location.service";

@Controller("location")
@ApiTags("location")
export class LocationController {
  constructor(
    private locationService: LocationService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiBearerAuth()
  @Get("/province")
  async getProvinces(@Request() req) {
    return this.locationService.getAllProvince();
  }

  @ApiBearerAuth()
  @Get("district/:id")
  getSingleSingleDistrict(@Param("id") id: number, @Request() req) {
    return this.locationService.getSingleDistrict(id);
  }

  @ApiBearerAuth()
  @Get("sector/:id")
  getSingleSingleSector(@Param("id") id: number, @Request() req) {
    return this.locationService.getSingleSector(id);
  }
  @ApiBearerAuth()
  @Get("cell/:id")
  getSingleSingleCell(@Param("id") id: number, @Request() req) {
    return this.locationService.getSingleCell(id);
  }
  @ApiBearerAuth()
  @Get("village/:id")
  getSingleSingleVillage(@Param("id") id: number, @Request() req) {
    return this.locationService.getSingleVillage(id);
  }
}
