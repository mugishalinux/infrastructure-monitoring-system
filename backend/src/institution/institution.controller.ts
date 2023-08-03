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
import { AuthService } from "../auth/auth.service";
import { FilterHelper } from "../helpers/filter.helper";
import { Not } from "typeorm";

import { HasRoles } from "../auth/has-roles.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { InstitutionService } from "./institution.service";
import { InstitutionRegisterDto } from "./register.institution";
import { InstitutionUpateDto } from "./update.dto";


@Controller("institution")
@ApiTags("institution")
export class InstitutionController {
  constructor(
    private institutionService: InstitutionService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}
  @HasRoles("admin")
  @Post("creation")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createInstitution(@Body() data: InstitutionRegisterDto, @Request() req) {
    return this.institutionService.createInstitution(data, req.user.userId);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  getSingleInstitution(@Param("id") id: number, @Request() req) {
    console.log();
    return this.institutionService.getSingleInstitution(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("")
  getSingleAllInstitution() {
    return this.institutionService.getAllInstitution();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  updateInstitution(
    @Param("id") id: number,
    @Body() data: InstitutionUpateDto,
    @Request() req,
  ) {
    return this.institutionService.updateInstitution(id, data, req.user.userId);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  deleteInstitution(@Param("id") id: number, @Request() req) {
    return this.institutionService.deleteInstitution(id, req.user.userId);
  }
}
