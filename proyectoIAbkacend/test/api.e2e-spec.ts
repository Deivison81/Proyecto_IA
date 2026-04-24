import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../src/interfaces/http/auth/auth.controller';
import { HealthController } from '../src/interfaces/http/health/health.controller';
import { AuthService } from '../src/application/auth/auth.service';
import { HealthService } from '../src/interfaces/http/health/health.service';

describe('API endpoints (e2e)', () => {
  let app: INestApplication<App>;

  const authService = {
    register: jest.fn().mockResolvedValue({
      accessToken: 'register-token',
      tokenType: 'Bearer',
      user: {
        id: 'user-1',
        name: 'Cliente Demo',
        email: 'cliente@empresa.com',
        role: 'client',
      },
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'login-token',
      tokenType: 'Bearer',
      user: {
        id: 'user-2',
        name: 'Admin Demo',
        email: 'admin@empresa.com',
        role: 'platform_admin',
      },
    }),
    listUsers: jest.fn(),
    updateUser: jest.fn(),
  };

  const healthService = {
    check: jest.fn().mockResolvedValue({
      status: 'ok',
      timestamp: '2026-04-23T00:00:00.000Z',
      services: {
        api: 'up',
        database: 'up',
      },
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, HealthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: HealthService, useValue: healthService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns backend health', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(body.services.database).toBe('up');
      });
  });

  it('POST /api/v1/auth/register validates the payload', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'Li',
        email: 'correo-invalido',
        password: '123',
        role: 'guest',
      })
      .expect(400);
  });

  it('POST /api/v1/auth/login returns the mocked JWT payload', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@empresa.com',
        password: 'Demo1234',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.accessToken).toBe('login-token');
        expect(body.user.role).toBe('platform_admin');
      });
  });
});