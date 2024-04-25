import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import argon from 'argon2';
import { eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import { users } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { CreateUserDto, LoginUserDto } from './auth.validator';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
    private jwtService: JwtService,
  ) {}

  async register({
    email,
    name,
    password,
    response,
  }: CreateUserDto & { response: Response }) {
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
      response.cookie('accessToken', accessToken, {
        domain: 'localhost',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        signed: true,
        maxAge: 24 * 60 * 60,
      });
      return { message: 'You are registered successfully', accessToken };
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: error },
      );
    }
  }

  async login({
    email,
    password,
    response,
  }: LoginUserDto & { response: Response }) {
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
      response.cookie('accessToken', accessToken, {
        domain: 'localhost',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        signed: true,
        maxAge: 24 * 60 * 60,
      });
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
