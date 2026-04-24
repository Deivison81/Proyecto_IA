import { Controller, Get, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Verifica estado de API y conexion a base de datos',
  })
  checkHealth() {
    return this.healthService.check();
  }
}
