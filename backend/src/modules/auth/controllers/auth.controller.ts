import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dtos/input/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(dto); // llamamos al método de login del servicio de autenticación, pasando el DTO de login como argumento, el servicio se encargará de validar las credenciales y generar el token JWT si las credenciales son correctas, finalmente retornamos el token de acceso generado
  }
}
