import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistoriaClinica, NewHistoriaClinica } from '../historia-clinica.model';

export type PartialUpdateHistoriaClinica = Partial<IHistoriaClinica> & Pick<IHistoriaClinica, 'id'>;

type RestOf<T extends IHistoriaClinica | NewHistoriaClinica> = Omit<T, 'fecha'> & {
  fecha?: string | null;
};

export type RestHistoriaClinica = RestOf<IHistoriaClinica>;

export type NewRestHistoriaClinica = RestOf<NewHistoriaClinica>;

export type PartialUpdateRestHistoriaClinica = RestOf<PartialUpdateHistoriaClinica>;

export type EntityResponseType = HttpResponse<IHistoriaClinica>;
export type EntityArrayResponseType = HttpResponse<IHistoriaClinica[]>;

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/historia-clinicas');

  create(historiaClinica: NewHistoriaClinica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaClinica);
    return this.http
      .post<RestHistoriaClinica>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(historiaClinica: IHistoriaClinica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaClinica);
    return this.http
      .put<RestHistoriaClinica>(`${this.resourceUrl}/${this.getHistoriaClinicaIdentifier(historiaClinica)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(historiaClinica: PartialUpdateHistoriaClinica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaClinica);
    return this.http
      .patch<RestHistoriaClinica>(`${this.resourceUrl}/${this.getHistoriaClinicaIdentifier(historiaClinica)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHistoriaClinica>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHistoriaClinica[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHistoriaClinicaIdentifier(historiaClinica: Pick<IHistoriaClinica, 'id'>): number {
    return historiaClinica.id;
  }

  compareHistoriaClinica(o1: Pick<IHistoriaClinica, 'id'> | null, o2: Pick<IHistoriaClinica, 'id'> | null): boolean {
    return o1 && o2 ? this.getHistoriaClinicaIdentifier(o1) === this.getHistoriaClinicaIdentifier(o2) : o1 === o2;
  }

  addHistoriaClinicaToCollectionIfMissing<Type extends Pick<IHistoriaClinica, 'id'>>(
    historiaClinicaCollection: Type[],
    ...historiaClinicasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const historiaClinicas: Type[] = historiaClinicasToCheck.filter(isPresent);
    if (historiaClinicas.length > 0) {
      const historiaClinicaCollectionIdentifiers = historiaClinicaCollection.map(historiaClinicaItem =>
        this.getHistoriaClinicaIdentifier(historiaClinicaItem),
      );
      const historiaClinicasToAdd = historiaClinicas.filter(historiaClinicaItem => {
        const historiaClinicaIdentifier = this.getHistoriaClinicaIdentifier(historiaClinicaItem);
        if (historiaClinicaCollectionIdentifiers.includes(historiaClinicaIdentifier)) {
          return false;
        }
        historiaClinicaCollectionIdentifiers.push(historiaClinicaIdentifier);
        return true;
      });
      return [...historiaClinicasToAdd, ...historiaClinicaCollection];
    }
    return historiaClinicaCollection;
  }

  protected convertDateFromClient<T extends IHistoriaClinica | NewHistoriaClinica | PartialUpdateHistoriaClinica>(
    historiaClinica: T,
  ): RestOf<T> {
    return {
      ...historiaClinica,
      fecha: historiaClinica.fecha?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restHistoriaClinica: RestHistoriaClinica): IHistoriaClinica {
    return {
      ...restHistoriaClinica,
      fecha: restHistoriaClinica.fecha ? dayjs(restHistoriaClinica.fecha) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHistoriaClinica>): HttpResponse<IHistoriaClinica> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHistoriaClinica[]>): HttpResponse<IHistoriaClinica[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
