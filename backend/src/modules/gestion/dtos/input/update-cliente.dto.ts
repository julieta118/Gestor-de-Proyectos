import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadosClientesEnum } from '../../enums/estados-clientes.enum';
import { ApiProperty } from '@nestjs/swagger';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiProperty({
    enum: EstadosClientesEnum,
    example: EstadosClientesEnum.ACTIVO,
  })
  @IsEnum(EstadosClientesEnum)
  @IsOptional()
  @ApiProperty()
  estado!: EstadosClientesEnum;
}
