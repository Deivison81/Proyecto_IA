import { UserRole } from './user-role.enum';
import { User } from './user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface UpdateUserInput {
  role?: UserRole;
  isActive?: boolean;
}

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  list(): Promise<User[]>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
}
