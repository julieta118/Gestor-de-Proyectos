import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListClienteDTO } from './listado/list.clientes.dto';
import { CreateClienteDTO } from './gestion/create.cliente.dto';
import { UpdateClienteDto } from './gestion/update.cliente.dto';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  constructor(private http: HttpClient) {}

  obtenerClientes(): Observable<ListClienteDTO[]> {
    return this.http.get<ListClienteDTO[]>('/api/v1/clientes');
  }

  obtenerCliente(id: number): Observable<ListClienteDTO> {
    return this.http.get<ListClienteDTO>(`/api/v1/clientes/${id}`);
  }

  crearCliente(dto: CreateClienteDTO): Observable<ListClienteDTO> {
    return this.http.post<ListClienteDTO>('/api/v1/clientes', dto);
  }

  actualizarCliente(id: number, dto: UpdateClienteDto): Observable<ListClienteDTO> {
    return this.http.put<ListClienteDTO>(`/api/v1/clientes/${id}`, dto);
  }
}
