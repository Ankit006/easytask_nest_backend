import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import { users } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';
import { CreateUserDto, LoginUserDto } from './auth.validator';

@Injectable()
export class AuthService {
  constructor(
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
    private jwtService: JwtService,
  ) {}

  async register({ email, name, password }: CreateUserDto) {
    try {
      const user = await this.dbClient.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (user) {
        throw new ConflictException('User already exist');
      }

      const hashPassword = await argon.hash(password);

      const res = await this.dbClient
        .insert(users)
        .values({ email, name, password: hashPassword })
        .returning({ id: users.id, email: users.email });

      const jwtPayload = res[0];

      const accessToken = await this.jwtService.signAsync(jwtPayload);

      return { message: 'You are registered successfully', accessToken };
    } catch (error) {
      handleExceptionThrow(error);
    }
  }

  async login({ email, password }: LoginUserDto) {
    try {
      const user = await this.dbClient.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!user) {
        throw new NotFoundException('Please provide correct email or password');
      }
      if (!(await argon.verify(user.password, password))) {
        throw new NotFoundException('Please provide correct email or password');
      }
      const jwtPayload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(jwtPayload);

      return { message: 'You are registered successfully', accessToken };
    } catch (error) {
      handleExceptionThrow(error);
    }
  }
}
