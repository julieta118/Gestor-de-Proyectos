// datos que se retornan en una consulta
import { ApiProperty } from '@nestjs/swagger';
import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';

export class ListTareasDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  descripcion!: string;

  @ApiProperty()
  estado!: EstadosTareasEnum;
}
