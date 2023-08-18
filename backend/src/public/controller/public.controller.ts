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

import { Not } from "typeorm";
import { PublicService } from "../service/public.service";

@Controller("public")
@ApiTags("public")
export class PublicController {
  constructor(private publicService: PublicService) {}

  @ApiBearerAuth()
  @Get("")
  getAllPublicClaimings() {
    return this.publicService.getAllClaiming();
  }
}
