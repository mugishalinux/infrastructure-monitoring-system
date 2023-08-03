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
import { Cell } from "./cell.entity";
import { District } from "./district.entity";
import { Province } from "./province.entity";
import { Sector } from "./sector.entity";
import { User } from "./user.entity";

@Entity("village")
export class Village extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, nullable: true })
  name: string;
  @ManyToOne(() => Cell, (cell) => cell.village)
  cell: Cell;
  @OneToMany(() => Claim, (claim) => claim)
  claim: Claim[];
}
