import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";
import { ReportController } from "./controller/report.controller";



@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule],
  controllers: [ ReportController],
  providers: [],
  exports: [],
})
export class ReportModule {}
