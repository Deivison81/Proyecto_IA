type Environment = Record<string, unknown>;

const requiredVariables = [
  'NODE_ENV',
  'PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'POSTGRES_PORT',
  'PGADMIN_DEFAULT_EMAIL',
  'PGADMIN_DEFAULT_PASSWORD',
  'PGADMIN_PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'MAIL_ENABLED',
  'MAIL_FROM',
] as const;

function assertValidPort(value: unknown, variableName: string): void {
  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    throw new Error(
      `Invalid ${variableName}: expected an integer between 1 and 65535.`,
    );
  }
}

export function validateEnvironment(config: Environment): Environment {
  for (const variable of requiredVariables) {
    const value = config[variable];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }

  assertValidPort(config.PORT, 'PORT');
  assertValidPort(config.POSTGRES_PORT, 'POSTGRES_PORT');
  assertValidPort(config.PGADMIN_PORT, 'PGADMIN_PORT');
  assertValidPort(config.DB_PORT, 'DB_PORT');

  const mailEnabled = String(config.MAIL_ENABLED).toLowerCase() === 'true';
  if (mailEnabled) {
    const requiredMailVariables = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
    ] as const;

    for (const variable of requiredMailVariables) {
      const value = config[variable];
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Missing required environment variable: ${variable}`);
      }
    }

    assertValidPort(config.SMTP_PORT, 'SMTP_PORT');
  }

  return config;
}
