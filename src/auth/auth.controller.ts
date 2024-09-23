import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  async login(@Body('userId') userId: number) {
    return this.authService.login(userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }
}
