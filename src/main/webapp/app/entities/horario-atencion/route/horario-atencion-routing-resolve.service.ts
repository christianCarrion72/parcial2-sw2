import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHorarioAtencion } from '../horario-atencion.model';
import { HorarioAtencionService } from '../service/horario-atencion.service';

const horarioAtencionResolve = (route: ActivatedRouteSnapshot): Observable<null | IHorarioAtencion> => {
  const id = route.params.id;
  if (id) {
    return inject(HorarioAtencionService)
      .find(id)
      .pipe(
        mergeMap((horarioAtencion: HttpResponse<IHorarioAtencion>) => {
          if (horarioAtencion.body) {
            return of(horarioAtencion.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default horarioAtencionResolve;
