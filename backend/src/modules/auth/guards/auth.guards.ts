import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Definimos una interfaz para el payload del token JWT, que incluye el ID y el nombre del usuario
interface JwtPayload {
  sub: number;
  nombre: string;
}

// Extendemos la interfaz Request de Express para incluir una propiedad opcional 'usuario' que contendrá el payload del token JWT después de la verificación
interface AuthenticatedRequest extends Request {
  usuario?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // El método canActivate se ejecuta cada vez que se intenta acceder a una ruta protegida por este guard, el método extrae el token JWT del encabezado de autorización de la solicitud, verifica el token utilizando el servicio de JWT, y si el token es válido, agrega el payload del token a la solicitud para que esté disponible en los controladores posteriores, si el token no es válido o no se proporciona, se lanza una excepción de UnauthorizedException
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.usuario = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  // Este método privado se encarga de extraer el token JWT del encabezado de autorización de la solicitud, el encabezado de autorización debe tener el formato 'Bearer <token>', por lo que el método divide el valor del encabezado en dos partes, verifica que el tipo sea 'Bearer' y devuelve el token si es válido, o undefined si no se proporciona un token válido
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
