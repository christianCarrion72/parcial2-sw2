import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PacienteResolve from './route/paciente-routing-resolve.service';

const pacienteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/paciente.component').then(m => m.PacienteComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/paciente-detail.component').then(m => m.PacienteDetailComponent),
    resolve: {
      paciente: PacienteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/paciente-update.component').then(m => m.PacienteUpdateComponent),
    resolve: {
      paciente: PacienteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/paciente-update.component').then(m => m.PacienteUpdateComponent),
    resolve: {
      paciente: PacienteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pacienteRoute;
