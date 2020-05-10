import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('DB_HOST'),
          password: configService.get('DB_PASSWORD'),
          username: configService.get('DB_USERNAME'),
          database: configService.get('DB_DATABASE'),
          port: configService.get('DB_PORT'),
          type: 'postgres',
          synchronize: false,
          entities: [User],
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
