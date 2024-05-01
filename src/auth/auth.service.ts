import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { eq } from 'drizzle-orm';
import { Response } from 'express';
import { customProvier } from 'src/constants';
import { users } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
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
      if (error.response && error.response.error) {
        if (error.response.error === 'Conflict') {
          throw new ConflictException(error.response.message);
        } else {
          throw new InternalServerErrorException(
            'Something went wrong in the server',
            { cause: error },
          );
        }
      }
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: error },
      );
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
      if (error.response) {
        if (error.response.error === 'Not Found') {
          throw new NotFoundException(error.response.message);
        }
      }
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: error },
      );
    }
  }

  logout(response: Response) {
    response.clearCookie('accessToken');
    return { message: 'You are logged out' };
  }
}
