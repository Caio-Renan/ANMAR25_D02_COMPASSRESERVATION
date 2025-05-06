import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { AuthResetDto } from "./dto/auth-reset.dto";
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";

@ApiTags('Auth')
@UseGuards(ThrottlerGuard)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login User' })
  @ApiBody({
    type: AuthLoginDto,
    examples: {
      default: {
        summary: 'Example Login Body',
        value: {
          email: 'Thiago.sampaio@compass.com',
          password: 'StrongPassword!2023',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Register User' })
  @ApiBody({
    type: AuthRegisterDto,
    examples: {
      default: {
        summary: 'Example Register Body',
        value: {
          name: 'Thiago Sampaio',
          email: 'Thiago.sampaio@compass.com',
          password: 'StrongPassword!2023',
          phone: '+55 (71) 98765-4321',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully', schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com', phone: '+55 (11) 98765-4321' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({
    type: AuthForgetDto,
    examples: {
      default: {
        summary: 'Example Forget Password Body',
        value: {
          email: 'Thiago.sampaio@compass.com',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent (even if email does not exist)' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post('forget')
  async forget(@Body() dto: AuthForgetDto) {
    return this.authService.forget(dto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    type: AuthResetDto,
    examples: {
      default: {
        summary: 'Example Reset Password Body',
        value: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          password: 'NewStrongPassword!2023',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token or validation error' })
  @ApiResponse({ status: 404, description: 'User not found for the provided token' })
  @ApiBody({
     type: AuthResetDto,
     examples: {
          default: {
               summary: 'Token',
               value: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
               }
          }
     }
  })
  @Post('reset')
  async reset(@Body() dto: AuthResetDto) {
    return this.authService.reset(dto);
  }

  @ApiOperation({ summary: 'Verify email' })
  @ApiQuery({
    name: 'token',
    description: 'Verification token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'User not found for the provided token' })
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}