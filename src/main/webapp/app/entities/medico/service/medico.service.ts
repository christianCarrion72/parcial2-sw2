import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedico, NewMedico } from '../medico.model';

export type PartialUpdateMedico = Partial<IMedico> & Pick<IMedico, 'id'>;

export type EntityResponseType = HttpResponse<IMedico>;
export type EntityArrayResponseType = HttpResponse<IMedico[]>;

@Injectable({ providedIn: 'root' })
export class MedicoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medicos');

  create(medico: NewMedico): Observable<EntityResponseType> {
    return this.http.post<IMedico>(this.resourceUrl, medico, { observe: 'response' });
  }

  update(medico: IMedico): Observable<EntityResponseType> {
    return this.http.put<IMedico>(`${this.resourceUrl}/${this.getMedicoIdentifier(medico)}`, medico, { observe: 'response' });
  }

  partialUpdate(medico: PartialUpdateMedico): Observable<EntityResponseType> {
    return this.http.patch<IMedico>(`${this.resourceUrl}/${this.getMedicoIdentifier(medico)}`, medico, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedico>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedico[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMedicoIdentifier(medico: Pick<IMedico, 'id'>): number {
    return medico.id;
  }

  compareMedico(o1: Pick<IMedico, 'id'> | null, o2: Pick<IMedico, 'id'> | null): boolean {
    return o1 && o2 ? this.getMedicoIdentifier(o1) === this.getMedicoIdentifier(o2) : o1 === o2;
  }

  addMedicoToCollectionIfMissing<Type extends Pick<IMedico, 'id'>>(
    medicoCollection: Type[],
    ...medicosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const medicos: Type[] = medicosToCheck.filter(isPresent);
    if (medicos.length > 0) {
      const medicoCollectionIdentifiers = medicoCollection.map(medicoItem => this.getMedicoIdentifier(medicoItem));
      const medicosToAdd = medicos.filter(medicoItem => {
        const medicoIdentifier = this.getMedicoIdentifier(medicoItem);
        if (medicoCollectionIdentifiers.includes(medicoIdentifier)) {
          return false;
        }
        medicoCollectionIdentifiers.push(medicoIdentifier);
        return true;
      });
      return [...medicosToAdd, ...medicoCollection];
    }
    return medicoCollection;
  }
}
