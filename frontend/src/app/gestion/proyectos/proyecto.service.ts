import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProyectoDTO } from './gestion/create.proyecto.dto';
import { UpdateProyectoDto } from './gestion/update.proyecto.dto';
import { ListProyectoDTO } from './listado/list.proyecto.dto';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  constructor(private http: HttpClient) {}

  obtenerProyectos(): Observable<ListProyectoDTO[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    });
    const url = `/api/v1/proyectos?cacheBuster=${Date.now()}`;

    return this.http.get<ListProyectoDTO[]>(url, {
      headers,
    });
  }

  obtenerProyecto(id: number): Observable<ListProyectoDTO> {
    return this.http.get<ListProyectoDTO>(`/api/v1/proyectos/${id}`);
  }

  crearProyecto(dto: CreateProyectoDTO): Observable<ListProyectoDTO> {
    return this.http.post<ListProyectoDTO>('/api/v1/proyectos', dto);
  }

  actualizarProyecto(id: number, dto: UpdateProyectoDto): Observable<ListProyectoDTO> {
    return this.http.put<ListProyectoDTO>(`/api/v1/proyectos/${id}`, dto);
  }
}
