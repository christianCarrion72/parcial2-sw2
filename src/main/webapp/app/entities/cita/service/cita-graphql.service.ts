import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICita, NewCita } from '../cita.model';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

// Definir el tipo de respuesta
export type EntityArrayResponseType = HttpResponse<ICita[]>;

@Injectable({ providedIn: 'root' })
export class CitaGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  query(queryObject: any): Observable<EntityArrayResponseType> {
    const query = `
      query getAllCitas($page: Int, $size: Int, $sort: String) {
        getAllCitas(page: $page, size: $size, sort: $sort, eagerload: true) {
          id
          fechaHora
          estado
          confirmada
          paciente {
            id
            nroHistoriaClinica
          }
          medico {
            id
            matricula
          }
          horario {
            id
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
        const citas = response.data.getAllCitas.map((cita: any) => ({
          ...cita,
          fechaHora: cita.fechaHora ? dayjs(cita.fechaHora) : undefined,
        }));
        return new HttpResponse<ICita[]>({
          body: citas,
          headers: new HttpHeaders({
            'X-Total-Count': response.data.totalCount || citas.length.toString(),
          }),
        });
      }),
    );
  }

  create(cita: NewCita | ICita): Observable<ICita> {
    const query = `
        mutation CreateCita($citaInput: CitaInput!) {
          createCita(citaInput: $citaInput) {
            id
            fechaHora
            estado
            confirmada
            paciente {
              id
              nroHistoriaClinica
            }
            medico {
              id
              matricula
            }
            horario {
              id
            }
          }
        }
      `;

    const variables = {
      citaInput: {
        fechaHora: cita.fechaHora?.format('YYYY-MM-DDTHH:mm:ssZ'), // Formato ISO 8601 completo
        estado: cita.estado,
        confirmada: cita.confirmada,
        pacienteId: cita.paciente?.id,
        medicoId: cita.medico?.id,
        horarioId: cita.horario?.id,
      },
    };

    console.log('Enviando creación con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const citaResponse = response.data.createCita;
        return {
          ...citaResponse,
          fechaHora: citaResponse.fechaHora ? dayjs(citaResponse.fechaHora) : undefined,
        };
      }),
    );
  }

  update(cita: ICita): Observable<ICita> {
    const query = `
      mutation UpdateCita($id: ID!, $citaInput: CitaInput!) {
        updateCita(id: $id, citaInput: $citaInput) {
          id
          fechaHora
          estado
          confirmada
          paciente {
            id
            nroHistoriaClinica
          }
          medico {
            id
            matricula
          }
          horario {
            id
          }
        }
      }
    `;

    const variables = {
      id: cita.id,
      citaInput: {
        id: cita.id,
        fechaHora: cita.fechaHora?.format('YYYY-MM-DDTHH:mm:ssZ'), // Formato ISO 8601 completo
        estado: cita.estado,
        confirmada: cita.confirmada,
        pacienteId: cita.paciente?.id,
        medicoId: cita.medico?.id,
        horarioId: cita.horario?.id,
      },
    };

    console.log('Enviando actualización con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const citaResponse = response.data.updateCita;
        return {
          ...citaResponse,
          fechaHora: citaResponse.fechaHora ? dayjs(citaResponse.fechaHora) : undefined,
        };
      }),
    );
  }

  find(id: number): Observable<ICita> {
    const query = `
      query GetCitaById($id: ID!) {
        getCitaById(id: $id) {
          id
          fechaHora
          estado
          confirmada
          paciente {
            id
            nroHistoriaClinica
          }
          medico {
            id
            matricula
          }
          horario {
            id
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
        const cita = response.data.getCitaById;
        return {
          ...cita,
          fechaHora: cita.fechaHora ? dayjs(cita.fechaHora) : undefined,
        };
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeleteCita($id: ID!) {
        deleteCita(id: $id)
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
          return response.data.deleteCita;
        }),
      );
  }
}
