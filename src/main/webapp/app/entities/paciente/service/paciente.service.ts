import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaciente, NewPaciente } from '../paciente.model';

export type PartialUpdatePaciente = Partial<IPaciente> & Pick<IPaciente, 'id'>;

type RestOf<T extends IPaciente | NewPaciente> = Omit<T, 'fechaNacimiento'> & {
  fechaNacimiento?: string | null;
};

export type RestPaciente = RestOf<IPaciente>;

export type NewRestPaciente = RestOf<NewPaciente>;

export type PartialUpdateRestPaciente = RestOf<PartialUpdatePaciente>;

export type EntityResponseType = HttpResponse<IPaciente>;
export type EntityArrayResponseType = HttpResponse<IPaciente[]>;

@Injectable({ providedIn: 'root' })
export class PacienteService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pacientes');

  create(paciente: NewPaciente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paciente);
    return this.http
      .post<RestPaciente>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(paciente: IPaciente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paciente);
    return this.http
      .put<RestPaciente>(`${this.resourceUrl}/${this.getPacienteIdentifier(paciente)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(paciente: PartialUpdatePaciente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paciente);
    return this.http
      .patch<RestPaciente>(`${this.resourceUrl}/${this.getPacienteIdentifier(paciente)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPaciente>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPaciente[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPacienteIdentifier(paciente: Pick<IPaciente, 'id'>): number {
    return paciente.id;
  }

  comparePaciente(o1: Pick<IPaciente, 'id'> | null, o2: Pick<IPaciente, 'id'> | null): boolean {
    return o1 && o2 ? this.getPacienteIdentifier(o1) === this.getPacienteIdentifier(o2) : o1 === o2;
  }

  addPacienteToCollectionIfMissing<Type extends Pick<IPaciente, 'id'>>(
    pacienteCollection: Type[],
    ...pacientesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pacientes: Type[] = pacientesToCheck.filter(isPresent);
    if (pacientes.length > 0) {
      const pacienteCollectionIdentifiers = pacienteCollection.map(pacienteItem => this.getPacienteIdentifier(pacienteItem));
      const pacientesToAdd = pacientes.filter(pacienteItem => {
        const pacienteIdentifier = this.getPacienteIdentifier(pacienteItem);
        if (pacienteCollectionIdentifiers.includes(pacienteIdentifier)) {
          return false;
        }
        pacienteCollectionIdentifiers.push(pacienteIdentifier);
        return true;
      });
      return [...pacientesToAdd, ...pacienteCollection];
    }
    return pacienteCollection;
  }

  protected convertDateFromClient<T extends IPaciente | NewPaciente | PartialUpdatePaciente>(paciente: T): RestOf<T> {
    return {
      ...paciente,
      fechaNacimiento: paciente.fechaNacimiento?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPaciente: RestPaciente): IPaciente {
    return {
      ...restPaciente,
      fechaNacimiento: restPaciente.fechaNacimiento ? dayjs(restPaciente.fechaNacimiento) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPaciente>): HttpResponse<IPaciente> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPaciente[]>): HttpResponse<IPaciente[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
