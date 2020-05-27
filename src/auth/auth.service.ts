import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user || !user.accountActive) {
      return null;
    }
    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (user && passwordMatches) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, nickname: user.nickname, roles: user.userRole };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
