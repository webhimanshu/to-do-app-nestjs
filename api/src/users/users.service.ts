import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  create(userData: Partial<User>) {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  findById(id: string) {
    const user = this.userRepo.findOne({ where: { id } });
    return user;
  }

  findByEmail(email: string) {
    const user = this.userRepo.findOne({ where: { email } });
    return user;
  }
}
