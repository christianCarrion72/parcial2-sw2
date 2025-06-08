import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedico } from '../medico.model';
import { MedicoService } from '../service/medico.service';

const medicoResolve = (route: ActivatedRouteSnapshot): Observable<null | IMedico> => {
  const id = route.params.id;
  if (id) {
    return inject(MedicoService)
      .find(id)
      .pipe(
        mergeMap((medico: HttpResponse<IMedico>) => {
          if (medico.body) {
            return of(medico.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default medicoResolve;
