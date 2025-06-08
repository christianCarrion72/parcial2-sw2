import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import MedicoResolve from './route/medico-routing-resolve.service';

const medicoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/medico.component').then(m => m.MedicoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/medico-detail.component').then(m => m.MedicoDetailComponent),
    resolve: {
      medico: MedicoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/medico-update.component').then(m => m.MedicoUpdateComponent),
    resolve: {
      medico: MedicoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/medico-update.component').then(m => m.MedicoUpdateComponent),
    resolve: {
      medico: MedicoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default medicoRoute;
