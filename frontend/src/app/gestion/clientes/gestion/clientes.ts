import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { ListClienteDTO } from '../listado/list.clientes.dto';
import { MessageService } from 'primeng/api';
import { CreateClienteDTO } from './create.cliente.dto';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-gestion-cliente',
  standalone: true,
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css'],
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, CommonModule]

})
export class GestionCliente {
  @Input() clienteSeleccionado: ListClienteDTO | null = null;
  @Output() cerrar = new EventEmitter<void>();


form = new FormGroup({
    nombre: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    estado: new FormControl<string | null>(null)
  });


  constructor(
    private clientesService: ClientesService,
    private messageService: MessageService
  ) {}

  ngOnChanges(): void {
    if (this.clienteSeleccionado) {
      this.form.patchValue(this.clienteSeleccionado);
    } else {
      this.form.reset();
    }
  }

 guardarCliente(): void {
  if (!this.form.valid) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos' });
    return;
  }

  const formValue = this.form.getRawValue();

  if (this.clienteSeleccionado) {
    
    const updateDto: any = {
      nombre: formValue.nombre!,
      estado: formValue.estado ?? undefined
    };
    this.clientesService.actualizarCliente(this.clienteSeleccionado.id, updateDto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado' });
        this.cerrar.emit();
      }
    });
  } else {
    
    const dto: CreateClienteDTO = {
      nombre: formValue.nombre!
    };
    this.clientesService.crearCliente(dto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado' });
        this.cerrar.emit();
      }
    });
  }
}}