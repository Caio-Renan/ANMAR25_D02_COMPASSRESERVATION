import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';  

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,  
    configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT Secret not configured!');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const userId = parseInt(payload.sub, 10);  

    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userService.findById(userId);  
    
    if (!user) {
      throw new Error('User not found');
    }
    return { 
      id: user.id, 
      email: user.email,
      role: user.role,  
    };
 
  }
}
