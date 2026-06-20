import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule, ButtonModule]
})
export class Login {
  nombre = '';
  clave = '';
form: any;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  iniciarSesion() {

    if (!this.nombre || !this.clave) {
      this.messageService.add({severity:'error', summary: 'Advertencia', detail: 'Por favor, ingrese su nombre y clave'});
      return;
    }
    this.authService.login(this.nombre, this.clave).subscribe({ // 
      next: (data) => {
        this.authService.guardarToken(data.accessToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al iniciar sesión'});
      }
    });
  } 
}