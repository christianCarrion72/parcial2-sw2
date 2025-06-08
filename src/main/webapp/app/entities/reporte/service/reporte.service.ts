import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReporte, NewReporte } from '../reporte.model';

export type PartialUpdateReporte = Partial<IReporte> & Pick<IReporte, 'id'>;

type RestOf<T extends IReporte | NewReporte> = Omit<T, 'fechaGeneracion'> & {
  fechaGeneracion?: string | null;
};

export type RestReporte = RestOf<IReporte>;

export type NewRestReporte = RestOf<NewReporte>;

export type PartialUpdateRestReporte = RestOf<PartialUpdateReporte>;

export type EntityResponseType = HttpResponse<IReporte>;
export type EntityArrayResponseType = HttpResponse<IReporte[]>;

@Injectable({ providedIn: 'root' })
export class ReporteService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reportes');

  create(reporte: NewReporte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reporte);
    return this.http
      .post<RestReporte>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reporte: IReporte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reporte);
    return this.http
      .put<RestReporte>(`${this.resourceUrl}/${this.getReporteIdentifier(reporte)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reporte: PartialUpdateReporte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reporte);
    return this.http
      .patch<RestReporte>(`${this.resourceUrl}/${this.getReporteIdentifier(reporte)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReporte>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReporte[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReporteIdentifier(reporte: Pick<IReporte, 'id'>): number {
    return reporte.id;
  }

  compareReporte(o1: Pick<IReporte, 'id'> | null, o2: Pick<IReporte, 'id'> | null): boolean {
    return o1 && o2 ? this.getReporteIdentifier(o1) === this.getReporteIdentifier(o2) : o1 === o2;
  }

  addReporteToCollectionIfMissing<Type extends Pick<IReporte, 'id'>>(
    reporteCollection: Type[],
    ...reportesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reportes: Type[] = reportesToCheck.filter(isPresent);
    if (reportes.length > 0) {
      const reporteCollectionIdentifiers = reporteCollection.map(reporteItem => this.getReporteIdentifier(reporteItem));
      const reportesToAdd = reportes.filter(reporteItem => {
        const reporteIdentifier = this.getReporteIdentifier(reporteItem);
        if (reporteCollectionIdentifiers.includes(reporteIdentifier)) {
          return false;
        }
        reporteCollectionIdentifiers.push(reporteIdentifier);
        return true;
      });
      return [...reportesToAdd, ...reporteCollection];
    }
    return reporteCollection;
  }

  protected convertDateFromClient<T extends IReporte | NewReporte | PartialUpdateReporte>(reporte: T): RestOf<T> {
    return {
      ...reporte,
      fechaGeneracion: reporte.fechaGeneracion?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReporte: RestReporte): IReporte {
    return {
      ...restReporte,
      fechaGeneracion: restReporte.fechaGeneracion ? dayjs(restReporte.fechaGeneracion) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReporte>): HttpResponse<IReporte> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReporte[]>): HttpResponse<IReporte[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
