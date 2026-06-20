import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/auth.service';
import { CerrarComponent } from '../cerrarSesion/cerrar';
import { ListProyectoDTO } from '../gestion/proyectos/listado/list.proyecto.dto';
import { ProyectoService } from '../gestion/proyectos/proyecto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CerrarComponent, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  proyectos: ListProyectoDTO[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private ProyectoService: ProyectoService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.ProyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = Array.isArray(data) ? data : [];
        this.calcularEstadisticas(this.proyectos);

        this.cd.detectChanges();
      },
      error: (error) => {
        this.proyectos = [];
        this.calcularEstadisticas(this.proyectos);
        this.cd.detectChanges();
      },
    });
  }

  verDetalles(id: number) {
    this.router.navigate(['/proyectos', id, 'tareas']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  totalProyectos = 0;
  proyectosActivosCount = 0;
  proyectosFinalizadosCount = 0;
  proyectosBajaCount = 0;
  mensajeCarga = '';
  mensajeClase = '';

  private calcularEstadisticas(proyectos: ListProyectoDTO[]): void {
    this.totalProyectos = proyectos.length;
    this.proyectosActivosCount = proyectos.filter(
      (p) => p.estado?.toLowerCase() === 'activo',
    ).length;
    this.proyectosFinalizadosCount = proyectos.filter(
      (p) => p.estado?.toLowerCase() === 'finalizado',
    ).length;
    this.proyectosBajaCount = proyectos.filter((p) => p.estado?.toLowerCase() === 'baja').length;

    if (this.totalProyectos > 10) {
    this.mensajeCarga = 'Alta carga de proyectos, ¡organizar prioridades!';
    this.mensajeClase = 'alta';
  } else if (this.totalProyectos > 0) {
    this.mensajeCarga = 'Carga moderada de proyectos, ¡buen ritmo de trabajo!';
    this.mensajeClase = 'moderada';
  } else {
    this.mensajeCarga = 'Sin proyectos activos actualmente.';
    this.mensajeClase = 'sin-proyectos';
  }
  }
}
