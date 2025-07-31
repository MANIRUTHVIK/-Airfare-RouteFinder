import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.password, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
