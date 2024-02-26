import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-delicate-pine-a58ibk4a.us-east-2.aws.neon.tech',
      port: 5432,
      username: 'hasangoli',
      password: 'Qwrsp1XvDda7',
      database: 'nest-auth',
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
    }),
    CoffeesModule,
    UsersModule,
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
