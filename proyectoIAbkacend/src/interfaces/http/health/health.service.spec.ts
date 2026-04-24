import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns ok when the database query succeeds', async () => {
    const service = new HealthService({
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    } as never);

    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.services.database).toBe('up');
  });

  it('returns degraded when the database query fails', async () => {
    const service = new HealthService({
      query: jest.fn().mockRejectedValue(new Error('db-down')),
    } as never);

    const result = await service.check();

    expect(result.status).toBe('degraded');
    expect(result.services.database).toBe('down');
  });
});