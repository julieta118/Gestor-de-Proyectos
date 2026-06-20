import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ClientesService } from '../../clientes/clientes.service';
import { ListClienteDTO } from '../../clientes/listado/list.clientes.dto';
import { EstadosProyectosEnum } from '../estados.proyectos.enum';
import { ListProyectoDTO } from '../listado/list.proyecto.dto';
import { ProyectoService } from '../proyecto.service';

@Component({
  selector: 'app-gestion-proyecto',
  standalone: true,
  templateUrl: './gestion.proyecto.html',
  styleUrls: ['./gestion.proyecto.css'],
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TableModule, CommonModule],
})
export class GestionProyecto implements OnChanges, OnInit {
  @Input() proyectoSeleccionado: ListProyectoDTO | null = null;
  @Output() cerrar = new EventEmitter<void>();

  clientes: ListClienteDTO[] = [];
  estadosDisponibles = Object.values(EstadosProyectosEnum);

  form = new FormGroup({
    nombre: new FormControl<string | null>('', Validators.required),
    estado: new FormControl<EstadosProyectosEnum | null>(null, Validators.required),
    idCliente: new FormControl<number | null>(null),
  });

  constructor(
    private proyectosService: ProyectoService,
    private clientesService: ClientesService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clientesService.obtenerClientes().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.clientes = data;
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes',
        });
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyectoSeleccionado']?.currentValue) {
      const proyecto = changes['proyectoSeleccionado'].currentValue;
      this.form.patchValue({
        nombre: proyecto.nombre,
        estado: proyecto.estado as EstadosProyectosEnum,
        idCliente: proyecto.cliente?.id || null,
      });
    } else if (changes['proyectoSeleccionado']?.previousValue) {
      this.form.reset();
    }
  }

  guardarProyecto(): void {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Complete todos los campos',
      });
      return;
    }

    const estado = this.form.get('estado')?.value;
    if (!estado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El estado es obligatorio',
      });
      return;
    }
    const dto = {
      nombre: this.form.get('nombre')?.value?.trim()!,
      estado: this.form.get('estado')?.value as EstadosProyectosEnum,
      idCliente: this.form.get('idCliente')?.value || null,
    };
    console.log('Payload proyecto:', dto);

    if (this.proyectoSeleccionado) {
      this.proyectosService.actualizarProyecto(this.proyectoSeleccionado.id, dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proyecto actualizado',
          });
          this.cerrar.emit();
        },
      });
    } else {

      const dto = {
        nombre: this.form.get('nombre')?.value?.trim()!,
        idCliente: this.form.get('idCliente')?.value || null,
      };
       console.log('Payload proyecto:', dto);
      this.proyectosService.crearProyecto(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proyecto creado',
          });
          this.cerrar.emit();
        },
      });
    }
  }
}
