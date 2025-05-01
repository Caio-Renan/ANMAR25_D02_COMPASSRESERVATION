import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpacesModule } from './spaces/spaces.module';

@Module({
  imports: [SpacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
