import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

const historiaClinicaResolve = (route: ActivatedRouteSnapshot): Observable<null | IHistoriaClinica> => {
  const id = route.params.id;
  if (id) {
    return inject(HistoriaClinicaService)
      .find(id)
      .pipe(
        mergeMap((historiaClinica: HttpResponse<IHistoriaClinica>) => {
          if (historiaClinica.body) {
            return of(historiaClinica.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default historiaClinicaResolve;
