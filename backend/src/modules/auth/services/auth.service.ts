import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/input/login.dto';
import { UsuariosService } from './usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const usuario = await this.usuariosService.ObtenerUsuarioActivoPorNombre(
      dto.nombre,
    ); // buscamos el usuario activo por su nombre utilizando el servicio de usuarios, si no se encuentra o está inactivo, lanzamos un error indicando que el usuario no fue encontrado o está inactivo

    if (!usuario) {
      throw new Error('Usuario no encontrado o inactivo');
    } // si el usuario se encuentra, comparamos la contraseña proporcionada en el DTO con la contraseña almacenada en la base de datos utilizando bcrypt, si las contraseñas no coinciden, lanzamos un error indicando que la contraseña es incorrecta

    if (!bcrypt.compareSync(dto.clave, usuario.clave)) {
      throw new Error('Contraseña incorrecta');
    }
    const payload = { sub: usuario.id, nombre: usuario.nombre };
    return {
      accessToken: this.jwtService.sign(payload), // generamos el token JWT utilizando el servicio de JWT, el payload del token incluye el ID y el nombre del usuario, y el token se firma con la clave secreta configurada en las variables de entorno, finalmente, retornamos un objeto que contiene el token de acceso generado
    };
  }
}
