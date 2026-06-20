import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { Usuario } from './entitites/usuario.entity';
import { AuthService } from './services/auth.service';
import { UsuariosService } from './services/usuarios.service';
import { AuthGuard } from './guards/auth.guards';

@Module({
  controllers: [AuthController],
  providers: [UsuariosService, AuthService, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.registerAsync({
      // configuramos el módulo de JWT de forma asíncrona para poder inyectar el ConfigService y obtener la clave secreta desde las variables de entorno
      inject: [ConfigService],
      global: true, // hacemos que el módulo de JWT esté disponible globalmente para que pueda ser utilizado en cualquier parte de la aplicación sin necesidad de importarlo explícitamente
      useFactory: (configService: ConfigService) => {
        // la función de fábrica que se ejecutará para configurar el módulo de JWT, recibe el ConfigService como parámetro para poder acceder a las variables de entorno
        return {
          secret: configService.get<string>('JWT_SECRET'), // obtenemos la clave secreta para firmar los tokens JWT desde las variables de entorno utilizando el ConfigService
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],

  exports: [AuthGuard], // exportamos el AuthGuard para que pueda ser utilizado en otros módulos de la aplicación, como el módulo de gestión, para proteger las rutas que requieren autenticación
})
export class AuthModule {}
