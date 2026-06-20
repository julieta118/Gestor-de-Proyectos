import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-cerrar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cerrar.html',
  styleUrls: ['./cerrar.css']
})
export class CerrarComponent {
  mostrarConfirmacion = false;

  constructor(private authService: AuthService, private router: Router) {}

  abrirConfirmacion() {
    this.mostrarConfirmacion = true;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cancelar() {
    this.mostrarConfirmacion = false;
  }
}
