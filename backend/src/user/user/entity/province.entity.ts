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
import { User } from "./user.entity";

@Entity("province")
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: true })
  name: string;
  @OneToMany(() => District, (district) => district.province)
  district: District[];
  @OneToMany(() => Claim, (claim) => claim.province)
  claim: Claim[];
}
