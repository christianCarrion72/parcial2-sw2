import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import HistoriaClinicaResolve from './route/historia-clinica-routing-resolve.service';

const historiaClinicaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/historia-clinica.component').then(m => m.HistoriaClinicaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/historia-clinica-detail.component').then(m => m.HistoriaClinicaDetailComponent),
    resolve: {
      historiaClinica: HistoriaClinicaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/historia-clinica-update.component').then(m => m.HistoriaClinicaUpdateComponent),
    resolve: {
      historiaClinica: HistoriaClinicaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/historia-clinica-update.component').then(m => m.HistoriaClinicaUpdateComponent),
    resolve: {
      historiaClinica: HistoriaClinicaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default historiaClinicaRoute;
