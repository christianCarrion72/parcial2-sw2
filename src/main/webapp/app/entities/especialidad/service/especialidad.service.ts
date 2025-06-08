import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEspecialidad, NewEspecialidad } from '../especialidad.model';

export type PartialUpdateEspecialidad = Partial<IEspecialidad> & Pick<IEspecialidad, 'id'>;

export type EntityResponseType = HttpResponse<IEspecialidad>;
export type EntityArrayResponseType = HttpResponse<IEspecialidad[]>;

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/especialidads');

  create(especialidad: NewEspecialidad): Observable<EntityResponseType> {
    return this.http.post<IEspecialidad>(this.resourceUrl, especialidad, { observe: 'response' });
  }

  update(especialidad: IEspecialidad): Observable<EntityResponseType> {
    return this.http.put<IEspecialidad>(`${this.resourceUrl}/${this.getEspecialidadIdentifier(especialidad)}`, especialidad, {
      observe: 'response',
    });
  }

  partialUpdate(especialidad: PartialUpdateEspecialidad): Observable<EntityResponseType> {
    return this.http.patch<IEspecialidad>(`${this.resourceUrl}/${this.getEspecialidadIdentifier(especialidad)}`, especialidad, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEspecialidad>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEspecialidad[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEspecialidadIdentifier(especialidad: Pick<IEspecialidad, 'id'>): number {
    return especialidad.id;
  }

  compareEspecialidad(o1: Pick<IEspecialidad, 'id'> | null, o2: Pick<IEspecialidad, 'id'> | null): boolean {
    return o1 && o2 ? this.getEspecialidadIdentifier(o1) === this.getEspecialidadIdentifier(o2) : o1 === o2;
  }

  addEspecialidadToCollectionIfMissing<Type extends Pick<IEspecialidad, 'id'>>(
    especialidadCollection: Type[],
    ...especialidadsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const especialidads: Type[] = especialidadsToCheck.filter(isPresent);
    if (especialidads.length > 0) {
      const especialidadCollectionIdentifiers = especialidadCollection.map(especialidadItem =>
        this.getEspecialidadIdentifier(especialidadItem),
      );
      const especialidadsToAdd = especialidads.filter(especialidadItem => {
        const especialidadIdentifier = this.getEspecialidadIdentifier(especialidadItem);
        if (especialidadCollectionIdentifiers.includes(especialidadIdentifier)) {
          return false;
        }
        especialidadCollectionIdentifiers.push(especialidadIdentifier);
        return true;
      });
      return [...especialidadsToAdd, ...especialidadCollection];
    }
    return especialidadCollection;
  }
}
