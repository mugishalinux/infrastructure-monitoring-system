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
import { User } from "../../user/user/entity/user.entity";
import { Institution } from "../../institution/entity/institution.entity";
import { District } from "../../user/user/entity/district.entity";
import { Province } from "../../user/user/entity/province.entity";
import { Sector } from "../../user/user/entity/sector.entity";
import { Cell } from "../../user/user/entity/cell.entity";
import { Village } from "../../user/user/entity/village.entity";

@Entity("claim")
export class Claim extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, type: "text" })
  description: string;
  @Column({ nullable: true, type: "text" })
  images: string;
  @Column()
  isResolved: boolean;
  @ManyToOne(() => Institution, (institution) => institution.claim)
  institution: Institution;
  @Column()
  status: number;
  @ManyToOne(() => District, (district) => district.claim, { nullable: true })
  district: District;
  @ManyToOne(() => Province, (province) => province.claim, { nullable: true })
  province: Province;
  @ManyToOne(() => Sector, (sector) => sector.claim, { nullable: true })
  sector: Sector;
  @ManyToOne(() => Cell, (cell) => cell.claim, { nullable: true })
  cell: Cell;
  @ManyToOne(() => Village, (village) => village.claim, { nullable: true })
  village: Village;
}
