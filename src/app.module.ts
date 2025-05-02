import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ReservationModule, 
    UsersModule, 
    SpacesModule, 
    ClientsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}