import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTareaDTo } from './create-tarea.dto';

export class UpdateTareaDto extends PartialType(CreateTareaDTo) {
  @ApiProperty({
    enum: EstadosTareasEnum,
    example: EstadosTareasEnum.PENDIENTE,
  })
  @IsEnum(EstadosTareasEnum)
  @IsOptional()
  @ApiProperty()
  estado? = EstadosTareasEnum.PENDIENTE;
}
