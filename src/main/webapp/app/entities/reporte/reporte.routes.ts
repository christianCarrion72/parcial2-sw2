import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ReporteResolve from './route/reporte-routing-resolve.service';

const reporteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/reporte.component').then(m => m.ReporteComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/reporte-detail.component').then(m => m.ReporteDetailComponent),
    resolve: {
      reporte: ReporteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/reporte-update.component').then(m => m.ReporteUpdateComponent),
    resolve: {
      reporte: ReporteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/reporte-update.component').then(m => m.ReporteUpdateComponent),
    resolve: {
      reporte: ReporteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reporteRoute;
