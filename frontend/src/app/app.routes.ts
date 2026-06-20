import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { ClientesListado } from './gestion/clientes/listado/list.clientes';
import { ProyectosListado } from './gestion/proyectos/listado/proyecto.listado';
import { TareasListado } from './gestion/tareas/listado/list.tarea';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'clientes',
    component: ClientesListado,
    canActivate: [AuthGuard],
  },

  {
    path: 'proyectos',
    component: ProyectosListado,
    canActivate: [AuthGuard],
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
  },

  {
    path: 'proyectos/:id/tareas',
    component: TareasListado,
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
