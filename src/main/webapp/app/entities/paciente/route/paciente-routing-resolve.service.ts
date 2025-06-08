import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaciente } from '../paciente.model';
import { PacienteService } from '../service/paciente.service';

const pacienteResolve = (route: ActivatedRouteSnapshot): Observable<null | IPaciente> => {
  const id = route.params.id;
  if (id) {
    return inject(PacienteService)
      .find(id)
      .pipe(
        mergeMap((paciente: HttpResponse<IPaciente>) => {
          if (paciente.body) {
            return of(paciente.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default pacienteResolve;
