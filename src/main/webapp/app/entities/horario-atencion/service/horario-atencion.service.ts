import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHorarioAtencion, NewHorarioAtencion } from '../horario-atencion.model';

export type PartialUpdateHorarioAtencion = Partial<IHorarioAtencion> & Pick<IHorarioAtencion, 'id'>;

export type EntityResponseType = HttpResponse<IHorarioAtencion>;
export type EntityArrayResponseType = HttpResponse<IHorarioAtencion[]>;

@Injectable({ providedIn: 'root' })
export class HorarioAtencionService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/horario-atencions');

  create(horarioAtencion: NewHorarioAtencion): Observable<EntityResponseType> {
    return this.http.post<IHorarioAtencion>(this.resourceUrl, horarioAtencion, { observe: 'response' });
  }

  update(horarioAtencion: IHorarioAtencion): Observable<EntityResponseType> {
    return this.http.put<IHorarioAtencion>(`${this.resourceUrl}/${this.getHorarioAtencionIdentifier(horarioAtencion)}`, horarioAtencion, {
      observe: 'response',
    });
  }

  partialUpdate(horarioAtencion: PartialUpdateHorarioAtencion): Observable<EntityResponseType> {
    return this.http.patch<IHorarioAtencion>(`${this.resourceUrl}/${this.getHorarioAtencionIdentifier(horarioAtencion)}`, horarioAtencion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHorarioAtencion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHorarioAtencion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHorarioAtencionIdentifier(horarioAtencion: Pick<IHorarioAtencion, 'id'>): number {
    return horarioAtencion.id;
  }

  compareHorarioAtencion(o1: Pick<IHorarioAtencion, 'id'> | null, o2: Pick<IHorarioAtencion, 'id'> | null): boolean {
    return o1 && o2 ? this.getHorarioAtencionIdentifier(o1) === this.getHorarioAtencionIdentifier(o2) : o1 === o2;
  }

  addHorarioAtencionToCollectionIfMissing<Type extends Pick<IHorarioAtencion, 'id'>>(
    horarioAtencionCollection: Type[],
    ...horarioAtencionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const horarioAtencions: Type[] = horarioAtencionsToCheck.filter(isPresent);
    if (horarioAtencions.length > 0) {
      const horarioAtencionCollectionIdentifiers = horarioAtencionCollection.map(horarioAtencionItem =>
        this.getHorarioAtencionIdentifier(horarioAtencionItem),
      );
      const horarioAtencionsToAdd = horarioAtencions.filter(horarioAtencionItem => {
        const horarioAtencionIdentifier = this.getHorarioAtencionIdentifier(horarioAtencionItem);
        if (horarioAtencionCollectionIdentifiers.includes(horarioAtencionIdentifier)) {
          return false;
        }
        horarioAtencionCollectionIdentifiers.push(horarioAtencionIdentifier);
        return true;
      });
      return [...horarioAtencionsToAdd, ...horarioAtencionCollection];
    }
    return horarioAtencionCollection;
  }
}
