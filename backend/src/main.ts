import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//- Se crea la aplicación NestJS a partir del módulo raíz (AppModule).
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config cabeceras de seguridad con Helmet.
  app.use(helmet());

  // todos los endpoint van a empezar con el prefijo /api:
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // habilitar el versionado d los enpoint:
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // cuando se hace una llamada a un endpoint y le pasamos un json, lo valide y arroje errores si no tiene la estructura correcta
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  //- se levanta la documentación Swagger interfaz web para probar los endpoints y ver cómo funcionan.
  if (process.env.SWAGGER_HABILITADO === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Sistema de Gestión de Proyectos')
      .setDescription(
        'Descripción de la API del sistema de gestión de proyectos',
      )
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(globalPrefix, app, document);
  }

  //- La aplicación escucha en el puerto definido en la variable de entorno PORT.Si no existe, usa el puerto 3000
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
