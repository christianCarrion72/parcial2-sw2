import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReporte } from '../reporte.model';
import { ReporteService } from '../service/reporte.service';

const reporteResolve = (route: ActivatedRouteSnapshot): Observable<null | IReporte> => {
  const id = route.params.id;
  if (id) {
    return inject(ReporteService)
      .find(id)
      .pipe(
        mergeMap((reporte: HttpResponse<IReporte>) => {
          if (reporte.body) {
            return of(reporte.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default reporteResolve;
