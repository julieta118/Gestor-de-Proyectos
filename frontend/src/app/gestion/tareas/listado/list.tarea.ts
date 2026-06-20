import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ListTareaDTO } from './list.tarea.dto';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { Tarea } from '../gestion/tarea';
import { tareasService } from '../tareas.service';
import { ProyectoDTO } from './proyecto.dto';

@Component({
  selector: 'app-tareas-listado',
  standalone: true,
  templateUrl: './list.tarea.html',
  styleUrls: ['./list.tarea.css'],
  imports: [TableModule, ButtonModule, TooltipModule, Tarea, CommonModule],
})
export class TareasListado implements OnInit {
  proyecto: ProyectoDTO | null = null;
  tareas: ListTareaDTO[] = [];
  cargando = true;

  dialogVisible = false;
  tareaSeleccionada: ListTareaDTO | null = null;

  idProyecto: number | null = null;

  constructor(
    private messageService: MessageService,
    private tareasService: tareasService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.idProyecto = Number(id);
        Promise.resolve().then(() => this.refreshProyecto());
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Id de proyecto no válido',
        });
        this.router.navigateByUrl('/proyectos');
      }
    });
  }

  refreshProyecto(): void {
    if (!this.idProyecto) return;

    this.cargando = true;
    this.tareasService.buscarProyecto(this.idProyecto).subscribe({
      next: (data) => {
        this.proyecto = data;

        const tareas = data?.tareas;
        this.tareas = Array.isArray(tareas) ? [...tareas] : [];
        console.log('tareas cargadas:', this.tareas);
        console.log('proyecto recibido:', data);

        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.tareas = [];
        this.cargando = false;
        this.cd.detectChanges();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener el proyecto',
        });
      },
    });
  }

  crearTarea(): void {
    this.tareaSeleccionada = null;
    this.dialogVisible = true;
  }

  actualizarTarea(tarea: ListTareaDTO): void {
    this.tareaSeleccionada = tarea;
    this.dialogVisible = true;
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.tareaSeleccionada = null;
    this.refreshProyecto();
  }
}
