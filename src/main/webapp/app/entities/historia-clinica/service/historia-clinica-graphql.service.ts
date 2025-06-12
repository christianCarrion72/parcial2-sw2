import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IHistoriaClinica, NewHistoriaClinica } from '../historia-clinica.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';

// Definir el tipo de respuesta
export type EntityArrayResponseType = HttpResponse<IHistoriaClinica[]>;

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  query(queryObject: any): Observable<EntityArrayResponseType> {
    const query = `
      query getAllHistoriasClinicas($page: Int, $size: Int, $sort: String) {
        getAllHistoriasClinicas(page: $page, size: $size, sort: $sort, eagerload: true) {
          id
          fecha
          sintomas
          diagnostico
          tratamiento
          hashBlockchain
          paciente {
            id
            nroHistoriaClinica
          }
        }
      }
    `;

    // Convertir el sort a string si es un array
    let sortString = queryObject.sort;
    if (Array.isArray(queryObject.sort)) {
      sortString = queryObject.sort.join(',');
    }

    const variables = {
      page: queryObject.page,
      size: queryObject.size,
      sort: sortString, // Usar el string convertido
    };

    console.log('Query variables:', variables); // Para debug

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const historiasClinicas = response.data.getAllHistoriasClinicas.map((historiaClinica: any) => ({
          ...historiaClinica,
          fecha: historiaClinica.fecha ? dayjs(historiaClinica.fecha) : undefined,
        }));
        return new HttpResponse<IHistoriaClinica[]>({
          body: historiasClinicas,
          headers: new HttpHeaders({
            'X-Total-Count': response.data.totalCount || historiasClinicas.length.toString(),
          }),
        });
      }),
    );
  }

  create(historiaClinica: NewHistoriaClinica | IHistoriaClinica): Observable<IHistoriaClinica> {
    const query = `
        mutation CreateHistoriaClinica($historiaClinicaInput: HistoriaClinicaInput!) {
          createHistoriaClinica(historiaClinicaInput: $historiaClinicaInput) {
            id
            fecha
            sintomas
            diagnostico
            tratamiento
            hashBlockchain
            paciente {
              id
              nroHistoriaClinica
            }
          }
        }
      `;

    const variables = {
      historiaClinicaInput: {
        fecha: historiaClinica.fecha?.format(DATE_FORMAT),
        sintomas: historiaClinica.sintomas,
        diagnostico: historiaClinica.diagnostico,
        tratamiento: historiaClinica.tratamiento,
        hashBlockchain: historiaClinica.hashBlockchain,
        pacienteId: historiaClinica.paciente?.id,
      },
    };

    console.log('Enviando creación con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const historiaClinicaResponse = response.data.createHistoriaClinica;
        return {
          ...historiaClinicaResponse,
          fecha: historiaClinicaResponse.fecha ? dayjs(historiaClinicaResponse.fecha) : undefined,
        };
      }),
    );
  }

  update(historiaClinica: IHistoriaClinica): Observable<IHistoriaClinica> {
    const query = `
      mutation UpdateHistoriaClinica($id: ID!, $historiaClinicaInput: HistoriaClinicaInput!) {
        updateHistoriaClinica(id: $id, historiaClinicaInput: $historiaClinicaInput) {
          id
          fecha
          sintomas
          diagnostico
          tratamiento
          hashBlockchain
          paciente {
            id
            nroHistoriaClinica
          }
        }
      }
    `;

    const variables = {
      id: historiaClinica.id,
      historiaClinicaInput: {
        id: historiaClinica.id,
        fecha: historiaClinica.fecha?.format(DATE_FORMAT),
        sintomas: historiaClinica.sintomas,
        diagnostico: historiaClinica.diagnostico,
        tratamiento: historiaClinica.tratamiento,
        hashBlockchain: historiaClinica.hashBlockchain,
        pacienteId: historiaClinica.paciente?.id,
      },
    };

    console.log('Enviando actualización con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const historiaClinicaResponse = response.data.updateHistoriaClinica;
        return {
          ...historiaClinicaResponse,
          fecha: historiaClinicaResponse.fecha ? dayjs(historiaClinicaResponse.fecha) : undefined,
        };
      }),
    );
  }

  find(id: number): Observable<IHistoriaClinica> {
    const query = `
      query GetHistoriaClinicaById($id: ID!) {
        getHistoriaClinicaById(id: $id) {
          id
          fecha
          sintomas
          diagnostico
          tratamiento
          hashBlockchain
          paciente {
            id
            nroHistoriaClinica
          }
        }
      }
    `;

    const variables = { id };

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const historiaClinica = response.data.getHistoriaClinicaById;
        return {
          ...historiaClinica,
          fecha: historiaClinica.fecha ? dayjs(historiaClinica.fecha) : undefined,
        };
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeleteHistoriaClinica($id: ID!) {
        deleteHistoriaClinica(id: $id)
      }
    `;

    const variables = { id };

    return this.http
      .post<any>(this.graphqlUrl, {
        query,
        variables: { id },
      })
      .pipe(
        map(response => {
          if (response.errors) {
            throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
          }
          return response.data.deleteHistoriaClinica;
        }),
      );
  }
}
