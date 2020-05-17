import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @Post('auth/login')
  async login(@Request() req: LoginRequest) {
    return this.authService.login(req.user);
  }
}
