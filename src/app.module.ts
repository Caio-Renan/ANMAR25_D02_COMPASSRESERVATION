import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';
import { ResourcesModule } from './resources/resources.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './common/config/env/validate-env';


@Module({
  imports: [
    AuthModule,
    ReservationModule, 
    UsersModule, 
    SpacesModule, 
    ResourcesModule, 
    ClientsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}