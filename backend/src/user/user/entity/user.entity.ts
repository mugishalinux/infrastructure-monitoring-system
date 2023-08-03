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

import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Role } from "../enums/role";
import { District } from "./district.entity";
import { Province } from "./province.entity";
import { Sector } from "./sector.entity";
import { Cell } from "./cell.entity";
import { Village } from "./village.entity";
import { Institution } from "../../../institution/entity/institution.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  lastName: string;
  @Column()
  firstName: string;
  @Column({ nullable: true })
  dob: Date;
  @Column({ nullable: true })
  profilePicture: string;
  @Column()
  primaryPhone: string;
  @Column({ nullable: true })
  @Exclude()
  password: string;
  @Column()
  access_level: string;
  @Column()
  status: number;
  @Column({ nullable: true })
  created_by: number;
  @Column()
  updated_by: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Institution)
  @JoinColumn()
  institution: Institution | null;
}
