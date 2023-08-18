import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import e from "express";
import { Claim } from "../../claims/entity/claim.entity";

export type Usa = any;
@Injectable()
export class PublicService {
  constructor() {}

  async getAllClaiming() {
    return Claim.find({
      relations: [
        "institution",
        "province",
        "district",
        "sector",
        "cell",
        "village",
      ],
      where: { status: Not(8) },
    });
  }
}
