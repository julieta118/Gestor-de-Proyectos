import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CreateTareaDTO } from './gestion/create.tarea.dto';
import { UpdateTareaDto } from './gestion/update.tarea.dto';
import { ProyectoDTO } from './listado/proyecto.dto';

@Injectable({ providedIn: 'root' })
export class tareasService {
  constructor(private httpClient: HttpClient) {}

  buscarProyecto(id: number | null): Observable<ProyectoDTO> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    });
    const params = new HttpParams().set('_', Date.now().toString());

    return this.httpClient
      .get<ProyectoDTO>(`/api/v1/proyectos/${id}`, {
        headers,
        params,
        observe: 'response',
      })
      .pipe(
        tap((response) => console.log('Raw proyecto response', response)),
        map((response) => response.body as ProyectoDTO),
      );
  }

    crearTarea(idProyecto: number | null, tarea: CreateTareaDTO): Observable<{ id: number }> {
        console.log('POST URL:', `/api/v1/proyectos/${idProyecto}/tareas`);
        console.log('Body enviado:', tarea);
        return this.httpClient.post<{ id: number }>("/api/v1/proyectos/" + idProyecto + "/tareas", tarea);
    }

    actualizarTarea(idProyecto: number | null, id: number, tarea: UpdateTareaDto): Observable<void> {
        return this.httpClient.put<void>("/api/v1/proyectos/" + idProyecto + "/tareas/" + id, tarea);
    }

}
