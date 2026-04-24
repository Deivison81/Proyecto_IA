export const USER_ROLES = [
  'client',
  'technician',
  'administrative',
  'platform_admin',
] as const;

export type UserRole = (typeof USER_ROLES)[number];
