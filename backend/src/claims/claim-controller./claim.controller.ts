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

@Controller("userClaims")
@ApiTags("userClaims")
export class UserClaimController {
  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}

  @ApiBearerAuth()
  @Get("/listing")
  async getAllClaims(@Request() req) {
    return this.claimService.listingAllClaims();
  }
}
