import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { InstitutionController } from "./institution.controller";
import { UserService } from "../user/user/user.service";
import {  InstitutionService } from "./institution.service";

@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule],
  controllers: [InstitutionController],
  providers: [
    UserService,
    InstitutionService,
    JwtService,
    FilterHelper,
  ],
  exports: [],
})
export class InstitutionModule {}
