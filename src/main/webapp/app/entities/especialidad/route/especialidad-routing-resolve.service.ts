import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEspecialidad } from '../especialidad.model';
import { EspecialidadService } from '../service/especialidad.service';

const especialidadResolve = (route: ActivatedRouteSnapshot): Observable<null | IEspecialidad> => {
  const id = route.params.id;
  if (id) {
    return inject(EspecialidadService)
      .find(id)
      .pipe(
        mergeMap((especialidad: HttpResponse<IEspecialidad>) => {
          if (especialidad.body) {
            return of(especialidad.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default especialidadResolve;
