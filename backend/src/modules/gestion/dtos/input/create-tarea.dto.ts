import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTareaDTo {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  descripcion!: string;
}
