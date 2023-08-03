import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AdminSeeder } from "./user/user/admin.seeder";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle("INFRASTRUCTURE CONDITION MONITORING SYSTEM v1")
    .setDescription(
      "INFRASTRUCTURE CONDITION MONITORING SYSTEM API description",
    )
    .setVersion("1.0")
    .addTag("INFRASTRUCTURE CONDITION MONITORING SYSTEM")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const appService = app.get(AdminSeeder);
  SwaggerModule.setup("/", app, document);
  app.enableCors();
  await app.listen(process.env.NODE_PORT || 3001);
}
bootstrap();
