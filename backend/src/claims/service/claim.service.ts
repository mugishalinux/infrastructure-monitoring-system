import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import e from "express";
import { ResponseService } from "../../response/response.service";
import { ClaimDto } from "../dto/claim.register.dto";
import { Claim } from "../entity/claim.entity";
import { Province } from "../../user/user/entity/province.entity";
import { District } from "../../user/user/entity/district.entity";
import { Sector } from "../../user/user/entity/sector.entity";
import { Cell } from "../../user/user/entity/cell.entity";
import { Village } from "../../user/user/entity/village.entity";
import { Institution } from "../../institution/entity/institution.entity";

export type Usa = any;
@Injectable()
export class ClaimService {
  constructor(private response: ResponseService) {}

  async createClaim(data: ClaimDto) {
    const province = await Province.findOne({
      where: { id: data.province },
    });
    if (!province)
      throw new BadRequestException(`This province ${data.province} not found`);
    const district = await District.findOne({
      where: { id: data.district },
    });
    if (!district)
      throw new BadRequestException(`This district ${data.district} not found`);

    const sector = await Sector.findOne({
      where: { id: data.sector },
    });
    if (!sector)
      throw new BadRequestException(`This sector ${data.sector} not found`);

    const cell = await Cell.findOne({
      where: { id: data.cell },
    });
    if (!cell)
      throw new BadRequestException(`This cell ${data.cell} not found`);
    const village = await Village.findOne({
      where: { id: data.village },
    });
    if (!village)
      throw new BadRequestException(`This village ${data.village} not found`);

    const institution = await Institution.findOne({
      where: { id: data.institution },
    });
    if (!institution)
      throw new BadRequestException(
        `This institution ${data.institution} not found`,
      );

    const claim = new Claim();
    claim.description = data.description;
    claim.images = data.image;
    claim.institution = institution;
    claim.isResolved = false;
    claim.status = 1;
    claim.province = province;
    claim.district = district;
    claim.sector = sector;
    claim.cell = cell;
    claim.village = village;

    try {
      const data = await claim.save();
      return this.response.postResponse(data.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async getAllUnResolvedClaims() {
    return Claim.find({
      relations: [
        "institution",
        "province",
        "district",
        "sector",
        "cell",
        "village",
      ],
      where: { isResolved: false, status: Not(8) },
    });
  }
  async getAllResolvedClaims() {
    return Claim.find({
      relations: [
        "institution",
        "province",
        "district",
        "sector",
        "cell",
        "village",
      ],
      where: { isResolved: true, status: Not(8) },
    });
  }
  async getAllClaims() {
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
  async getSingleClaim(id: number) {
    const claim = await Claim.findOne({
      relations: [
        "institution",
        "province",
        "district",
        "sector",
        "cell",
        "village",
      ],
      where: { status: Not(8), id: id },
    });
    if (!claim) throw new BadRequestException(`This claim ${id} not found`);
    return claim;
  }
  async deleteClaim(id: number, userId: number) {
    const claim = await Claim.findOne({
      where: { id },
    });

    if (!claim) throw new BadRequestException(`This claim ${id} not found`);
    try {
      claim.status = 8;

      await Claim.update(id, claim);
      return this.response.deleteResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
}
