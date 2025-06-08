import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import HorarioAtencionResolve from './route/horario-atencion-routing-resolve.service';

const horarioAtencionRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/horario-atencion.component').then(m => m.HorarioAtencionComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/horario-atencion-detail.component').then(m => m.HorarioAtencionDetailComponent),
    resolve: {
      horarioAtencion: HorarioAtencionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/horario-atencion-update.component').then(m => m.HorarioAtencionUpdateComponent),
    resolve: {
      horarioAtencion: HorarioAtencionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/horario-atencion-update.component').then(m => m.HorarioAtencionUpdateComponent),
    resolve: {
      horarioAtencion: HorarioAtencionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default horarioAtencionRoute;
