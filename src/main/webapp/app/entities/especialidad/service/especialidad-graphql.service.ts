import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEspecialidad, NewEspecialidad } from '../especialidad.model';

// Definir el tipo de respuesta
export type EntityArrayResponseType = HttpResponse<IEspecialidad[]>;

@Injectable({ providedIn: 'root' })
export class EspecialidadGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  query(queryObject: any): Observable<EntityArrayResponseType> {
    const query = `
      query getAllEspecialidades($page: Int, $size: Int, $sort: String) {
        getAllEspecialidades(page: $page, size: $size, sort: $sort) {
          id
          nombre
          descripcion
          medicos {
            id
            matricula
            user {
              id
              login
            }
          }
        }
      }
    `;

    const variables = {
      page: queryObject.page,
      size: queryObject.size,
      sort: queryObject.sort,
    };

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
        }
        const especialidades = response.data.getAllEspecialidades.map((esp: any) => ({
          ...esp,
          medicos:
            esp.medicos?.map((med: any) => ({
              ...med,
              matricula: med.matricula || 'Sin matrícula',
            })) || [],
        }));
        return new HttpResponse<IEspecialidad[]>({
          body: especialidades,
          headers: new HttpHeaders({
            'X-Total-Count': response.data.totalCount || especialidades.length.toString(),
          }),
        });
      }),
    );
  }

  create(especialidad: NewEspecialidad | IEspecialidad): Observable<IEspecialidad> {
    const query = `
        mutation CreateEspecialidad($especialidadInput: EspecialidadInput!) {
          createEspecialidad(especialidadInput: $especialidadInput) {
            id
            nombre
            descripcion
            medicos {
              id
              matricula
              user {
                id
                login
              }
            }
          }
        }
      `;

    // Asegurarnos de que los IDs de médicos se envíen correctamente
    console.log('Médicos antes de mapear:', especialidad.medicos);

    const variables = {
      especialidadInput: {
        nombre: especialidad.nombre,
        descripcion: especialidad.descripcion,
        medicosIds:
          especialidad.medicos && especialidad.medicos.length > 0
            ? especialidad.medicos.map(med => med.id).filter(id => id !== undefined)
            : [],
      },
    };

    console.log('Variables de mutación:', JSON.stringify(variables, null, 2));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        console.log('Respuesta de creación:', JSON.stringify(response.data, null, 2));
        return response.data.createEspecialidad;
      }),
    );
  }

  update(especialidad: IEspecialidad): Observable<IEspecialidad> {
    const query = `
      mutation UpdateEspecialidad($id: ID!, $especialidadInput: EspecialidadInput!) {
        updateEspecialidad(id: $id, especialidadInput: $especialidadInput) {
            id
            nombre
            descripcion
            medicos {
              id
              matricula
              user {
                id
                login
              }
            }
        }
      }
    `;

    const variables = {
      id: especialidad.id,
      especialidadInput: {
        nombre: especialidad.nombre,
        descripcion: especialidad.descripcion,
        medicosIds: especialidad.medicos?.map(med => med.id) || [],
      },
    };

    console.log('Enviando actualización de especialidad:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        console.log('Respuesta de actualización:', response.data);
        return response.data.updateEspecialidad;
      }),
    );
  }

  find(id: number): Observable<IEspecialidad> {
    const query = `
      query GetEspecialidadById($id: ID!) {
        getEspecialidadById(id: $id) {
          id
          nombre
          descripcion
          medicos {
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
        return response.data.getEspecialidadById;
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeleteEspecialidad($id: ID!) {
        deleteEspecialidad(id: $id)
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
          return response.data.deleteEspecialidad;
        }),
      );
  }
}
