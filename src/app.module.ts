import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CitiesModule } from './city/city.module';
import { UserSearchModule } from './user-search/user-search.module';
import { PrismaService } from './core/services/prisma.service';
import { ConnectionsModule } from './connections/connections.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CitiesModule,
    UserSearchModule,
    ConnectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
