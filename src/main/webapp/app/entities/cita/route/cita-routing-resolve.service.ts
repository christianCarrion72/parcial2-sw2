import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICita } from '../cita.model';
import { CitaService } from '../service/cita.service';

const citaResolve = (route: ActivatedRouteSnapshot): Observable<null | ICita> => {
  const id = route.params.id;
  if (id) {
    return inject(CitaService)
      .find(id)
      .pipe(
        mergeMap((cita: HttpResponse<ICita>) => {
          if (cita.body) {
            return of(cita.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default citaResolve;
