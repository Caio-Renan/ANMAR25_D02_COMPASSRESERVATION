import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserValidationService } from './usersValidate.service';

@Module({
  imports: [PrismaModule, forwardRef(() =>AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UserValidationService],
  exports: [UsersService]
})
export class UsersModule {}