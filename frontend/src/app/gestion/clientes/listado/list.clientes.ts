import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes.service';
import { ListClienteDTO } from './list.clientes.dto';
import { MessageService } from 'primeng/api';
import { GestionCliente } from '../gestion/clientes';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-clientes-listado',
  standalone: true,
  templateUrl: './list.clientes.html',
  styleUrls: ['./list.clientes.css'],
  imports: [ TableModule, ButtonModule, DialogModule, GestionCliente]
})
export class ClientesListado implements OnInit {
  clientes: ListClienteDTO[] = [];
  clienteSeleccionado: ListClienteDTO | null = null;
  visible = false; 

  constructor(
    private clientesService: ClientesService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refrescarClientes();
  }

  refrescarClientes(): void {
  this.clientesService.obtenerClientes().subscribe({
    next: (data) => {
      console.log('Clientes recibidos:', data);
      this.clientes = data;
      this.cd.detectChanges(); 
    },
    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes' })
  });

  }

  crearCliente(): void {
    this.clienteSeleccionado = null;
    this.visible = true;
  }

  editarCliente(cliente: ListClienteDTO): void {
    this.clienteSeleccionado = cliente;
    this.visible = true;
  }

  cerrarDialog(): void {
    this.visible = false;
    this.clienteSeleccionado = null;
    this.refrescarClientes(); 
}
}