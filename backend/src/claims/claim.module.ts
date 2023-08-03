import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";
import { FilterHelper } from "../helpers/filter.helper";
import { UserService } from "../user/user/user.service";
import { ClaimController } from "./controller/claim.controller";
import { ClaimService } from "./service/claim.service";

@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule],
  controllers: [ClaimController,],
  providers: [UserService, JwtService, FilterHelper,ClaimService],
  exports: [],
})
export class ClaimModule {}
