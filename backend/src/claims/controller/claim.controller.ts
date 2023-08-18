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
import { User } from "../../user/user/entity/user.entity";

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
  @UseGuards(JwtAuthGuard)
  @Get("/list/fetch")
  async getAllClaims(@Request() req) {
    const user = await User.findOne({ where: { id: req.user.userId } });
    if (!user)
      throw new BadRequestException(`This user ${req.user.userId} not found`);
    if (user.access_level == "user") {
      return this.claimService.getAllCaimsPerInstitution(req.user.userId);
    } else if (user.access_level == "admin") {
      return this.claimService.getAllClaims();
    }
  }

  @ApiBearerAuth()
  @Get("/listing")
  async listingAllClaims() {
    return this.claimService.listingAllClaims();
  }

  @ApiBearerAuth()
  @Get("/get/institution/claims")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getInstitutionClaims(@Request() req) {
    const user = await User.findOne({ where: { id: req.user.userId } });
    if (!user)
      throw new BadRequestException(`This user ${req.user.userId} not found`);
    console.log(req.user.userId);
    // return this.claimService.getAllCaimsPerInstitution(req.user.userId);
  }
  @ApiBearerAuth()
  @Put("/update/claims/:status/:id")
  async updateClaimStatus(
    @Param("status") status: string,
    @Param("id") id: number,
  ) {
    return this.claimService.updateClaimStatus(status, id);
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
