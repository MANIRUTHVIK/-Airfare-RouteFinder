import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('AirFair API')
    .setDescription('AirFair API description')
    .setVersion('1.0')
    .addTag('air-fair')
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document());
  app.use(cookieParser());
  app.enableCors({ origin: '*', credentials: true });
  await app.listen(process.env.PORT ?? '0.0.0.0');
}
bootstrap();
