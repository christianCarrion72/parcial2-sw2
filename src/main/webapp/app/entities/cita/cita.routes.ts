import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CitaResolve from './route/cita-routing-resolve.service';

const citaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/cita.component').then(m => m.CitaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/cita-detail.component').then(m => m.CitaDetailComponent),
    resolve: {
      cita: CitaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/cita-update.component').then(m => m.CitaUpdateComponent),
    resolve: {
      cita: CitaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/cita-update.component').then(m => m.CitaUpdateComponent),
    resolve: {
      cita: CitaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default citaRoute;
