import { ApiProperty } from '@nestjs/swagger';
import { EstadosClientesEnum } from '../../enums/estados-clientes.enum';

export class ListClientesDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  estado!: EstadosClientesEnum;
}
