import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';

@Module({
  imports: [ReservationModule, UsersModule, SpacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}