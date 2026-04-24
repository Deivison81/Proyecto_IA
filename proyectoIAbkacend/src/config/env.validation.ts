type Environment = Record<string, unknown>;

const requiredVariables = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'MAIL_ENABLED',
  'MAIL_FROM',
] as const;

const requiredDbVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
] as const;

function assertValidPort(value: unknown, variableName: string): void {
  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    throw new Error(
      `Invalid ${variableName}: expected an integer between 1 and 65535.`,
    );
  }
}

function assertOptionalPort(config: Environment, variableName: string): void {
  const value = config[variableName];

  if (value === undefined || value === null || String(value).trim().length === 0) {
    return;
  }

  assertValidPort(value, variableName);
}

export function validateEnvironment(config: Environment): Environment {
  for (const variable of requiredVariables) {
    const value = config[variable];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }

  assertValidPort(config.PORT, 'PORT');
  assertOptionalPort(config, 'POSTGRES_PORT');
  assertOptionalPort(config, 'PGADMIN_PORT');

  const databaseUrl = config.DATABASE_URL;
  const hasDatabaseUrl =
    typeof databaseUrl === 'string' && databaseUrl.trim().length > 0;

  if (!hasDatabaseUrl) {
    for (const variable of requiredDbVariables) {
      const value = config[variable];
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(
          `Missing required environment variable: ${variable} (or set DATABASE_URL)`,
        );
      }
    }

    assertValidPort(config.DB_PORT, 'DB_PORT');
  } else {
    assertOptionalPort(config, 'DB_PORT');
  }

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
