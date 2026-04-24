import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async check() {
    let databaseStatus = 'up';

    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      databaseStatus = 'down';
    }

    return {
      status: databaseStatus === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        api: 'up',
        database: databaseStatus,
      },
    };
  }
}
