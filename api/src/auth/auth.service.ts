import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async register(dto: RegisterDto) {
    const { name, gender, country, hobbies, email, password } = dto;

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('SALT--->', salt);
    const hasedPassword = await bcrypt.hash(password, salt);
    console.log('HASED_PASSWORD-->', hasedPassword);

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

  async login() {}
}
