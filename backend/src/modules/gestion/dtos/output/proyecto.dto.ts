import { ApiProperty } from '@nestjs/swagger';
import { EstadosProyectosEnum } from '../../enums/estados-proyectos.enum';
import { ListTareasDto } from './list-tarea.dto';

export class ProyectoDto {
  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  estado!: EstadosProyectosEnum;

  @ApiProperty()
  cliente!: string;

  @ApiProperty()
  tareas!: ListTareasDto[]; //array de tareas dto
}
