import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTareaDTo } from '../dtos/input/create-tarea.dto';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { TareasService } from '../services/tarea.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guards';

@Controller('proyectos/:proyectoId/tareas') // Ruta base para las tareas de un proyecto específico
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @ApiBearerAuth() // Indica que este endpoint requiere autenticación con token Bearer en swagger
  @UseGuards(AuthGuard) // Aplica el guard de autenticación a este endpoint, lo que significa que solo los usuarios autenticados podrán acceder a esta ruta para crear una tarea dentro de un proyecto específico
  @Post()
  async crearTarea(
    @Body() dto: CreateTareaDTo,
    @Param('proyectoId') proyectoId: number, // Obtiene el ID del proyecto desde la ruta
  ): Promise<number> {
    return await this.tareasService.crearTarea(dto, proyectoId); // Devuelve el ID de la tarea creada
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) // Aplica el guard de autenticación a este endpoint, lo que significa que solo los usuarios autenticados podrán acceder a esta ruta para actualizar una tarea específica
  @Put(':id')
  async actualizarTarea(
    @Body() dto: UpdateTareaDto,
    @Param('id') id: number,
  ): Promise<void> {
    return await this.tareasService.actualizarTarea(dto, id);
  }
}
