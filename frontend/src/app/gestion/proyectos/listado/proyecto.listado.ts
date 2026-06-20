import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { GestionProyecto } from '../gestion/gestion.proyecto';
import { ProyectoService } from '../proyecto.service';
import { ListProyectoDTO } from './list.proyecto.dto';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyectos-listado',
  standalone: true,
  templateUrl: './proyecto.listado.html',
  styleUrls: ['./proyecto.listado.css'],
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    GestionProyecto,
    FormsModule,
  ],
})
export class ProyectosListado {
  proyectos: ListProyectoDTO[] = [];
  proyectosFiltrados: ListProyectoDTO[] = [];
  proyectoSeleccionado: ListProyectoDTO | null = null;

  visible = false;
  busqueda: string = '';
  orden: string = 'az';

  constructor(
    private proyectoService: ProyectoService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refrescarProyectos();
  }

  refrescarProyectos(): void {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.proyectosFiltrados = [...data];
        this.ordenarProyectos();
        this.cd.detectChanges();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los proyectos',
        }),
    });
  }

  crearProyecto(): void {
    this.proyectoSeleccionado = null;
    this.visible = true;
    this.cd.detectChanges();
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.proyectoSeleccionado = proyecto;
    this.visible = true;
    this.cd.detectChanges();
  }

  cerrarDialog(): void {
    this.visible = false;
    this.proyectoSeleccionado = null;
    this.refrescarProyectos();
  }

  verTareas(idProyecto: number): void {
    this.router.navigate(['/proyectos', idProyecto, 'tareas']);
  }

  filtrarProyectos(): void {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      this.proyectosFiltrados = [...this.proyectos];
    } else {
      this.proyectosFiltrados = this.proyectos.filter((proyecto) =>
        (proyecto.nombre ?? '').toLowerCase().includes(texto)
      );
    }

    this.ordenarProyectos();
  }

  ordenarProyectos(): void {
    switch (this.orden) {
      case 'az':
        this.proyectosFiltrados.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        break;

      case 'za':
        this.proyectosFiltrados.sort((a, b) =>
          b.nombre.localeCompare(a.nombre)
        );
        break;

      case 'estado':
        this.proyectosFiltrados.sort((a, b) =>
          a.estado.localeCompare(b.estado)
        );
        break;

      case 'id':
        this.proyectosFiltrados.sort((a, b) => a.id - b.id);
        break;
    }
  }

  exportarCSV(): void {
  const encabezados = ['ID', 'Nombre', 'Cliente', 'Estado'];

  const filas = this.proyectosFiltrados.map(proyecto => [
    proyecto.id,
    proyecto.nombre,
    proyecto.cliente?.nombre ?? 'Sin cliente',
    proyecto.estado
  ]);

  const csv = [
  encabezados.join(';'),
  ...filas.map(fila => fila.join(';'))
].join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });

  const link = document.createElement('a');
  const url = window.URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'listado_proyectos.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}