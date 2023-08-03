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
import { Claim } from "../../claims/entity/claim.entity";

@Entity("institution")
export class Institution extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, type: "text" })
  institutionName: string;
  @Column()
  status: number;
  @OneToOne(() => User, (user) => user.institution) // specify inverse side as a second parameter
  user: User;
  @OneToMany(() => Claim, (claim) => claim.institution) // specify inverse side as a second parameter
  claim: Claim[];
}
