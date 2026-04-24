import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AuthService } from '../../../application/auth/auth.service';
import { USER_REPOSITORY } from '../../../domain/users/user-repository.port';
import { JwtStrategy } from '../../../infrastructure/auth/jwt.strategy';
import { UserEntity } from '../../../infrastructure/database/typeorm/entities/user.entity';
import { TypeormUserRepository } from '../../../infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { MailModule } from '../../../infrastructure/mail/mail.module';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
