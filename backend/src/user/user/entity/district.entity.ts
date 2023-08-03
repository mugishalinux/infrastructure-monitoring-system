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
import { Province } from "./province.entity";
import { Sector } from "./sector.entity";
import { User } from "./user.entity";

@Entity("district")
export class District extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: true })
  name: string;
  @ManyToOne(() => Province, (province) => province.district)
  province: Province;
  @OneToMany(() => Sector, (sector) => sector.district)
  sector: Sector[];
  @OneToMany(() => Claim, (claim) => claim)
  claim: Claim[];
}
