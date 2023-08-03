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
import { FilterHelper } from "../../helpers/filter.helper";
import { Not } from "typeorm";
import { ClaimService } from "../service/claim.service";
import { HasRoles } from "../../auth/has-roles.decorator";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ClaimDto } from "../dto/claim.register.dto";
import { RolesGuard } from "../../auth/roles.guard";

@Controller("claims")
@ApiTags("claims")
export class ClaimController {
  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}
  @Post("creation")
  @ApiBearerAuth()
  async createClaim(@Body() data: ClaimDto, @Request() req) {
    return this.claimService.createClaim(data);
  }

  @ApiBearerAuth()
  @Get(":id")
  getSingleClaim(@Param("id") id: number, @Request() req) {
    console.log();
    return this.claimService.getSingleClaim(id);
  }

  @ApiBearerAuth()
  @Get("/list/fetch")
  getAllClaims() {
    return this.claimService.getAllClaims();
  }

  @ApiBearerAuth()
  @Get("/unResolved/list")
  getUnResolvedClaims() {
    return this.claimService.getAllUnResolvedClaims();
  }
  @ApiBearerAuth()
  @Get("/resolved/list")
  getResolvedClaims() {
    return this.claimService.getAllResolvedClaims();
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  deleteClaim(@Param("id") id: number, @Request() req) {
    return this.claimService.deleteClaim(id, req.user.userId);
  }
}
