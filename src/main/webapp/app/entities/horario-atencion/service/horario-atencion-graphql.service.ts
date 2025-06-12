import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IHorarioAtencion, NewHorarioAtencion } from '../horario-atencion.model';

// Definir el tipo de respuesta
export type EntityArrayResponseType = HttpResponse<IHorarioAtencion[]>;

@Injectable({ providedIn: 'root' })
export class HorarioAtencionGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  query(queryObject: any): Observable<EntityArrayResponseType> {
    const query = `
      query getAllHorariosAtencion($page: Int, $size: Int, $sort: String) {
        getAllHorariosAtencion(page: $page, size: $size, sort: $sort, eagerload: true) {
          id
          diaSemana
          horaInicio
          horaFin
          medico {
            id
            matricula
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
        const horarioAtencions = response.data.getAllHorariosAtencion; // También cambia aquí
        return new HttpResponse<IHorarioAtencion[]>({
          body: horarioAtencions,
          headers: new HttpHeaders({
            'X-Total-Count': response.data.totalCount || horarioAtencions.length.toString(),
          }),
        });
      }),
    );
  }

  create(horarioAtencion: NewHorarioAtencion | IHorarioAtencion): Observable<IHorarioAtencion> {
    const query = `
        mutation CreateHorarioAtencion($horarioInput: HorarioAtencionInput!) {
          createHorarioAtencion(horarioInput: $horarioInput) {
            id
            diaSemana
            horaInicio
            horaFin
            medico {
              id
              matricula
            }
          }
        }
      `;

    const variables = {
      horarioInput: {
        diaSemana: horarioAtencion.diaSemana,
        horaInicio: horarioAtencion.horaInicio,
        horaFin: horarioAtencion.horaFin,
        medicoId: horarioAtencion.medico?.id,
      },
    };

    console.log('Enviando creación con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        return response.data.createHorarioAtencion;
      }),
    );
  }

  update(horarioAtencion: IHorarioAtencion): Observable<IHorarioAtencion> {
    const query = `
      mutation UpdateHorarioAtencion($id: ID!, $horarioInput: HorarioAtencionInput!) {
        updateHorarioAtencion(id: $id, horarioInput: $horarioInput) {
          id
          diaSemana
          horaInicio
          horaFin
          medico {
            id
            matricula
          }
        }
      }
    `;

    const variables = {
      id: horarioAtencion.id,
      horarioInput: {
        id: horarioAtencion.id,
        diaSemana: horarioAtencion.diaSemana,
        horaInicio: horarioAtencion.horaInicio,
        horaFin: horarioAtencion.horaFin,
        medicoId: horarioAtencion.medico?.id,
      },
    };

    console.log('Enviando actualización con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        return response.data.updateHorarioAtencion;
      }),
    );
  }

  find(id: number): Observable<IHorarioAtencion> {
    const query = `
      query GetHorarioAtencionById($id: ID!) {
        getHorarioAtencionById(id: $id) {
          id
          diaSemana
          horaInicio
          horaFin
          medico {
            id
            matricula
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
        return response.data.getHorarioAtencionById;
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeleteHorarioAtencion($id: ID!) {
        deleteHorarioAtencion(id: $id)
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
          return response.data.deleteHorarioAtencion;
        }),
      );
  }
}
