import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserRole } from './user/entities/user-role.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { UserPendingActivation } from './user/entities/user-pending-activation.entity';
import { SearchModule } from './search/search.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/review.entity';

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
          entities: [User, UserRole, UserPendingActivation, Review],
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: configService.get('GMAIL_USERNAME'),
              pass: configService.get('GMAIL_PASSWORD'),
            },
          },
          defaults: {
            from: '"Pindrop Application" <pindrop@app.com>',
          },
          template: {
            dir: join(__dirname, '../..', '/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    SearchModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
