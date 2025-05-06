import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesSevice } from './resources.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResourceValidationService } from './resourcesValidate.service';

@Module({
  imports: [PrismaModule],
  controllers: [ResourcesController],
  providers: [ResourcesSevice, ResourceValidationService],
})
export class ResourcesModule {}
