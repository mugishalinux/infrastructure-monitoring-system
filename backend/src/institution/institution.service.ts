import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import e from "express";
import { ResponseService } from "../response/response.service";
import { InstitutionUpateDto } from "./update.dto";
import { Institution } from "./entity/institution.entity";
import { InstitutionRegisterDto } from "./register.institution";
export type Usa = any;
@Injectable()
export class InstitutionService {
  constructor(private response: ResponseService) {}

  async createInstitution(data: InstitutionRegisterDto, id: number) {
    const institution = new Institution();
    institution.institutionName = data.institutionName;
    institution.status = 1;
    try {
      const data = await institution.save();
      return this.response.postResponse(data.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async updateInstitution(id: number, data: InstitutionUpateDto, userId: number) {
    const institution = await Institution.findOne({
      where: { id },
    });
    if (!institution)
      throw new BadRequestException(`This institution ${id} not found`);
    institution.institutionName = data.institutionName;

    try {
      const data = await Institution.update(id, institution);
      return this.response.updateResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async getAllInstitution() {
    return Institution.find({ where: { status: Not(8) } });
  }
  async getSingleInstitution(id: number) {
    const institution = await Institution.findOne({
      where: { status: Not(8), id: id },
    });
    if (!institution)
      throw new BadRequestException(`This institution ${id} not found`);
    return institution;
  }
  async deleteInstitution(id: number, userId: number) {
    const institution = await Institution.findOne({
      where: { id },
    });

    if (!institution)
      throw new BadRequestException(`This institution ${id} not found`);
    try {
      institution.status = 8;

      await Institution.update(id, institution);
      return this.response.deleteResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
}
