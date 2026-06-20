import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entitites/usuario.entity';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async ObtenerUsuarioActivoPorNombre(nombre: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOneBy({
      estado: EstadosUsuariosEnum.ACTIVO,
      nombre: nombre,
    });
  }
}
