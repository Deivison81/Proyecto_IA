import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../../application/auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import type { AuthenticatedUser } from './types/authenticated-user';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Version('1')
  @ApiOperation({ summary: 'Registra un usuario con rol base' })
  register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Version('1')
  @ApiOperation({ summary: 'Inicia sesion y retorna JWT' })
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna perfil del usuario autenticado' })
  me(@CurrentUser() user: AuthenticatedUser | null) {
    return user;
  }

  @Get('users')
  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('platform_admin', 'administrative')
  @ApiOperation({ summary: 'Lista usuarios visibles para operacion administrativa' })
  listUsers() {
    return this.authService.listUsers();
  }

  @Patch('users/:userId')
  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('platform_admin')
  @ApiOperation({ summary: 'Actualiza rol o estado de un usuario' })
  updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRequestDto,
  ) {
    return this.authService.updateUser(userId, dto);
  }
}
