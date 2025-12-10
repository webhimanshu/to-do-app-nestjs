import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
