import { Claim } from "../../../claims/entity/claim.entity";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { District } from "./district.entity";
import { Province } from "./province.entity";
import { Sector } from "./sector.entity";
import { User } from "./user.entity";
import { Village } from "./village.entity";

@Entity("cell")
export class Cell extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: true })
  name: string;
  @ManyToOne(() => Sector, (sector) => sector.cell)
  sector: Sector;
  @OneToMany(() => Village, (village) => village.cell)
  village: Village[];
  @OneToMany(() => Claim, (claim) => claim)
  claim: Claim[];
}
