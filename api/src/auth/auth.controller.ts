import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() userDto: RegisterDto) {
    const user = await this.authService.register(userDto);
    return { success: true, data: user };
  }
}
