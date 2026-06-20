import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(nombre: string, clave: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      '/api/v1/auth',
      { nombre, clave }
    );
  }

  guardarToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    sessionStorage.clear();

    this.router.navigate(['/login']);
  }
}