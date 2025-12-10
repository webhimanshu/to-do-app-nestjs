import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const { name, gender, country, hobbies, email, password } = dto;
    // console.log('find email using userservice');
    // const emailV1 = await this.userService.findByEmail(email);
    // console.log('🚀 ~ AuthService ~ register ~ emailV1:', emailV1);

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const salt = await bcrypt.genSalt(saltRounds);
    const hasedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      name,
      gender,
      country,
      hobbies,
      email,
      password: hasedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safe } = savedUser;
    return safe;
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const userExists = await this.userRepository.findOne({ where: { email } });

    if (!userExists) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const success = await bcrypt.compare(password, userExists.password);
    if (!success) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const payload = { email, sub: userExists.id };
    const expiresIn: StringValue = (process.env.JWT_EXPIRES_IN ??
      '1d') as StringValue;
    const accessToken = this.jwtService.sign(payload, {
      expiresIn,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safe } = userExists;
    return {
      message: 'Login successful',
      accessToken,
      ...safe,
    };
  }
}
