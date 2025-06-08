import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EspecialidadResolve from './route/especialidad-routing-resolve.service';

const especialidadRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/especialidad.component').then(m => m.EspecialidadComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/especialidad-detail.component').then(m => m.EspecialidadDetailComponent),
    resolve: {
      especialidad: EspecialidadResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/especialidad-update.component').then(m => m.EspecialidadUpdateComponent),
    resolve: {
      especialidad: EspecialidadResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/especialidad-update.component').then(m => m.EspecialidadUpdateComponent),
    resolve: {
      especialidad: EspecialidadResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default especialidadRoute;
