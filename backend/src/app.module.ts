import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GestionModule } from './modules/gestion/gestion.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      //forRoot()configura la conexión global a la base de datos.

      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      logging: process.env.BD_LOGGING === 'true', //  ver las consultas que el orm generó
      logger: 'advanced-console', // especifica el nivel de detalle de las consultas generadas por el orm
    }),
    AuthModule,
    GestionModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
