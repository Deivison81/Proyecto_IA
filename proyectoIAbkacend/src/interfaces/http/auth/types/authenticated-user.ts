import type { UserRole } from '../../../../domain/users/user-role.enum';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}
