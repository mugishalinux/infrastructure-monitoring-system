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

import { HasRoles } from "../../auth/has-roles.decorator";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

import { RolesGuard } from "../../auth/roles.guard";
import { User } from "../../user/user/entity/user.entity";
import { Claim } from "../../claims/entity/claim.entity";
import { Province } from "../../user/user/entity/province.entity";

@Controller("report")
@ApiTags("report")
export class ReportController {
  constructor() {}

  @ApiBearerAuth()
  @Get("/countClaims/:id")
  async getAllClaims(@Param("id") id: number) {
    const user = await User.findOne({
      where: { id },
      relations: ["institution"],
    });
    if (!user) {
      throw new BadRequestException("user not found");
    }
    try {
      return await Claim.count({
        where: { status: Not(8), institution: { id: user.institution.id } },
      });
    } catch (e) {
      throw new BadRequestException("bad request");
    }
  }
  @ApiBearerAuth()
  @Get("/count/claims/fixed/:id")
  async getAllClaimsFixed(@Param("id") id: number) {
    const user = await User.findOne({
      where: { id },
      relations: ["institution"],
    });
    if (!user) {
      throw new BadRequestException("user not found");
    }
    try {
      return Claim.count({
        where: {
          status: Not(8),
          institution: { id: user.institution.id },
          isResolved: true,
        },
      });
    } catch (e) {
      throw new BadRequestException("bad request");
    }
  }
  @ApiBearerAuth()
  @Get("/count/claims/unfixed/:id")
  async getAllClaimsUnFixed(@Param("id") id: number) {
    const user = await User.findOne({
      where: { id },
      relations: ["institution"],
    });
    if (!user) {
      throw new BadRequestException("user not found");
    }
    try {
      return Claim.count({
        where: {
          status: Not(8),
          institution: { id: user.institution.id },
          isResolved: false,
        },
      });
    } catch (e) {
      throw new BadRequestException("bad request");
    }
  }

  @ApiBearerAuth()
  @Get("/claims/per/location/:id")
  async countClaimsPerLocation(@Param("id") id: number) {
    const user = await User.findOne({
      where: { id },
      relations: ["institution"],
    });
    if (!user) {
      throw new BadRequestException("user not found");
    }
    const locations = await Province.find();

    const transformedLocations = locations.map((district) => {
      return {
        id: district.id,
        name: district.name,
      };
    });

    const resultArray = []; // Initialize an empty array

    for (let i = 0; i < transformedLocations.length; i++) {
      const value = await Claim.count({
        where: {
          province: { id: transformedLocations[i].id },
          institution: { id: user.institution.id },
        },
      });

      const locationName = transformedLocations[i].name;

      // Push an object into the array during each iteration
      resultArray.push({
        name: locationName,
        total: value,
      });
    }

    return resultArray;
  }
}
