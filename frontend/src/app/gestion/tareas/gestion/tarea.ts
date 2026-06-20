import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EstadosTareasEnum } from '../estados.tareas.enum';
import { ListTareaDTO } from '../listado/list.tarea.dto';
import { tareasService } from '../tareas.service';
import { CreateTareaDTO } from './create.tarea.dto';
import { UpdateTareaDto } from './update.tarea.dto';

@Component({
  selector: 'app-gestion-tarea',
  standalone: true,
  templateUrl: './tarea.html',
  styleUrls: ['./tarea.css'],
  imports: [CommonModule, DialogModule, InputTextModule, ButtonModule, ReactiveFormsModule],
})
export class Tarea {
  @Input() visible = false;
  @Input() tareaSeleccionada: ListTareaDTO | null = null;
  @Input() idProyecto: number | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();
  estados: string[] = Object.values(EstadosTareasEnum);

  form: FormGroup = new FormGroup({
    descripcion: new FormControl<string>('', Validators.required),
    estado: new FormControl<EstadosTareasEnum | null>(null),
  });

  constructor(
    private messageService: MessageService,
    private tareasService: tareasService,
  ) {}

  ngOnChanges(): void {
  if (this.tareaSeleccionada) {
    this.form.get('estado')?.setValidators([Validators.required]);
    this.form.patchValue({
      descripcion: this.tareaSeleccionada.descripcion,
      estado: this.tareaSeleccionada.estado as EstadosTareasEnum
    });
  } else {
    this.form.get('estado')?.clearValidators();
    this.form.reset({
      descripcion: '',
      estado: null
    });
  }
  this.form.get('estado')?.updateValueAndValidity();
}

  cerrarDialog(): void {
    this.form.reset({ descripcion: '', estado: null });
    this.cerrar.emit();
  }

  guardarTarea(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Complete todos los campos requeridos.',
      });
      return;
    }

    const formRawValue = this.form.getRawValue();

    if (this.tareaSeleccionada) {
      const dto: UpdateTareaDto = {
        descripcion: formRawValue.descripcion,
        estado: formRawValue.estado as EstadosTareasEnum,
      };
      this.tareasService
        .actualizarTarea(this.idProyecto!, this.tareaSeleccionada.id, dto)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Tarea actualizada correctamente.',
            });
            this.cerrarDialog();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la tarea',
            });
          },
        });
    } else {
      const { descripcion } = this.form.value; 
      const dto: CreateTareaDTO = { descripcion: descripcion! };
       console.log('Payload creación:', dto);

      this.tareasService.crearTarea(this.idProyecto!,{ ...dto }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tarea creada correctamente.',
          });
          this.cerrarDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la tarea',
          });
        },
      });
    }
  }
}
