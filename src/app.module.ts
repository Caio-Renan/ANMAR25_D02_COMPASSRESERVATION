import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [ReservationModule, UsersModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
