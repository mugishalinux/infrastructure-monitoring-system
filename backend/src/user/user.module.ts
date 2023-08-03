import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { AdminSeeder } from "./user/admin.seeder";
import { LocationController } from "./user/location.controller";
import { LocationService } from "./user/location.service";

@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule],
  controllers: [UserController, LocationController],
  providers: [
    UserService,
    LocationService,
    JwtService,
    AdminSeeder,
    FilterHelper,
  ],
  exports: [UserService, AdminSeeder],
})
export class UserModule {}
