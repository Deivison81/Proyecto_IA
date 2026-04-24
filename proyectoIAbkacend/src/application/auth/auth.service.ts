import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotificationService } from '../notifications/notification.service';
import { USER_REPOSITORY } from '../../domain/users/user-repository.port';
import { UserRole } from '../../domain/users/user-role.enum';
import type { UserRepositoryPort } from '../../domain/users/user-repository.port';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateUserInput {
  role?: UserRole;
  isActive?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async register(input: RegisterInput) {
    const email = input.email.toLowerCase().trim();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('El correo ya se encuentra registrado.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
      role: input.role,
    });

    await this.notificationService.sendRegistrationEmail(
      user.email,
      user.name,
      user.role,
    );

    return this.issueToken(user.id, user.email, user.role, user.name);
  }

  async login(input: LoginInput) {
    const email = input.email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    return this.issueToken(user.id, user.email, user.role, user.name);
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no autorizado.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async listUsers() {
    const users = await this.userRepository.list();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }));
  }

  async updateUser(userId: string, input: UpdateUserInput) {
    const updated = await this.userRepository.update(userId, input);

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
    };
  }

  private issueToken(
    userId: string,
    email: string,
    role: UserRole,
    name: string,
  ) {
    const payload = { sub: userId, email, role, name };

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      user: {
        id: userId,
        name,
        email,
        role,
      },
    };
  }
}
