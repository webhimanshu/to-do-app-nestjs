import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() userDto: RegisterDto) {
    const user = await this.authService.register(userDto);
    return { success: true, data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return { success: true, data };
  }
}
