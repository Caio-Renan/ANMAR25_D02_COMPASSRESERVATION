import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [ReservationModule, UsersModule, SpacesModule, ResourcesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
