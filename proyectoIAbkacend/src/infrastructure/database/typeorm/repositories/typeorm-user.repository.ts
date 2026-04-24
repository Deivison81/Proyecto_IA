import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserInput,
  UserRepositoryPort,
  UpdateUserInput,
} from '../../../../domain/users/user-repository.port';
import { User } from '../../../../domain/users/user';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TypeormUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const entity = this.repository.create({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      isActive: true,
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async list(): Promise<User[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    if (input.role) {
      entity.role = input.role;
    }

    if (typeof input.isActive === 'boolean') {
      entity.isActive = input.isActive;
    }

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
