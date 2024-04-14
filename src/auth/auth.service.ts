import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { CreateUserDto } from 'src/database/database.validator';

@Injectable()
export class AuthService {
  supabaseClient: SupabaseClient<any, 'public', any>;

  constructor(private configService: ConfigService) {
    const client = createClient(
      configService.get<string>('SUPABASE_URL'),
      configService.get<string>('SUPABASE_API_KEY'),
    );
    this.supabaseClient = client;
  }

  async signup({ email, name, password }: CreateUserDto) {
    const { data, error } = await this.supabaseClient.auth.signUp({
      email,
      password,
    });
    console.log(name);
    return { data, error };
  }
}
