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
import { Province } from "./entity/province.entity";
import { District } from "./entity/district.entity";
import { Sector } from "./entity/sector.entity";
import { Cell } from "./entity/cell.entity";
import { Village } from "./entity/village.entity";

export type Usa = any;
@Injectable()
export class LocationService {
  constructor(private response: ResponseService) {}

  async getAllProvince() {
    return Province.find();
  }
  async getAllDistrict() {
    return District.find();
  }

  async getAllSectors() {
    return Sector.find();
  }

  async getSingleDistrict(id: number) {
    const province = await Province.findOne({
      where: { id: id },
    });
    if (!province)
      throw new BadRequestException(`This province ${id} not found`);
    return District.find({
      where: { province: { id: province.id } },
    });
  }

  async getSingleSector(id: number) {
    const district = await District.findOne({
      where: { id: id },
    });
    if (!district)
      throw new BadRequestException(`This district ${id} not found`);
    return Sector.find({
      where: { district: { id: district.id } },
    });
  }
  async getSingleCell(id: number) {
    const sector = await Sector.findOne({
      where: { id: id },
    });
    if (!sector) throw new BadRequestException(`This sector ${id} not found`);
    return Cell.find({
      where: { sector: { id: sector.id } },
    });
  }
  async getSingleVillage(id: number) {
    const cell = await Cell.findOne({
      where: { id: id },
    });
    if (!cell) throw new BadRequestException(`This cell ${id} not found`);
    return Village.find({
      where: { cell: { id: cell.id } },
    });
  }
}
