import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesSevice } from './resources.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResourcesController],
  providers: [ResourcesSevice],
})
export class ResourcesModule {}
