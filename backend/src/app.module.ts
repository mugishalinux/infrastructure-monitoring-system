import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule } from "@nestjs/config";
import { User } from "./user/user/entity/user.entity";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "./user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/roles.guard";
import { FilterHelper } from "./helpers/filter.helper";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bull";
import { ResponseModule } from "./response/response.module";
import { ReportModule } from "./reports/report.module";
import { InstitutionModule } from "./institution/institution.module";
import { Province } from "./user/user/entity/province.entity";
import { District } from "./user/user/entity/district.entity";
import { Sector } from "./user/user/entity/sector.entity";
import { Village } from "./user/user/entity/village.entity";
import { Cell } from "./user/user/entity/cell.entity";
import { Institution } from "./institution/entity/institution.entity";
import { ClaimModule } from "./claims/claim.module";
import { Claim } from "./claims/entity/claim.entity";
import { PublicModule } from "./public/public.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: "./imageFiles",
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      entities: [
        User,
        Institution,
        Province,
        District,
        Sector,
        Village,
        Cell,
        Claim,
      ],
      logging: false,
      synchronize: false,
      // logging:true
    }),
    // PeriodsModule,
    InstitutionModule,
    HttpModule,
    AuthModule,
    UserModule,
    ResponseModule,
    ReportModule,
    ClaimModule,
    PublicModule,
    // LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService, FilterHelper],
})
export class AppModule {}
