import { ForbiddenException, NotFoundException, UnauthorizedException, BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthValidateService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService
) {}

  async validateUserExistsByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    return user;    
  }
  
  async validateUserStatus(user: User) {
    if (user.status === 'INACTIVE') {
      throw new ForbiddenException('User is inactive');
    }
  }
  
  async validatePassword(dto: UpdateUserDto, user: User) {
    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
  }
  
  async validateUserExistsForRecovery(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
  
  async validateUserFromToken(userId: string) {
    if (!userId) {
      throw new BadRequestException('Token payload does not contain a valid user ID');
    }
  
    const user = await this.userService.findOne(Number(userId));
  
    if (!user) {
      throw new NotFoundException('No user found for the provided token');
    }
  
    return user;
  }
  
  ensureValidClientId(clientId: unknown) {
    if (!clientId || typeof clientId !== 'number') {
      throw new BadRequestException('Invalid Token');
    }
  }
  
}