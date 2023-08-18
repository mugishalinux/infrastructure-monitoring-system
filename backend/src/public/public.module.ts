import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { UserService } from "../user/user/user.service";
import { PublicController } from "./controller/public.controller";
import { PublicService } from "./service/public.service";

@Module({
  imports: [],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [],
})
export class PublicModule {}
