import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './controllers/clientes.controllers';
import { ProyectosController } from './controllers/proyectos.controllers';
import { TareasController } from './controllers/tareas.controllers';
import { Cliente } from './entitites/cliente.entity';
import { Proyecto } from './entitites/proyecto.entity';
import { Tareas } from './entitites/tareas.entity';
import { ClientesService } from './services/cliente.service';
import { ProyectosService } from './services/proyecto.service';
import { TareasService } from './services/tarea.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ClientesController, ProyectosController, TareasController],
  providers: [TareasService, ClientesService, ProyectosService],
  imports: [TypeOrmModule.forFeature([Tareas, Cliente, Proyecto]), AuthModule], //forFeature: Le dice a NestJS qué entidades (tablas de la base de datos) querés usar dentro de ese módulo.

  exports: [],
})
export class GestionModule {}
