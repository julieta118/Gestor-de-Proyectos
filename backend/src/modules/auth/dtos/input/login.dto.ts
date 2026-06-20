import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string; //    ! para que no esten vacios .... opcional se usa: ?
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clave!: string;
}
