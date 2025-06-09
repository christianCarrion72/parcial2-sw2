import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IMedico, NewMedico } from '../medico.model';

// Definir el tipo de respuesta
export type EntityArrayResponseType = HttpResponse<IMedico[]>;

@Injectable({ providedIn: 'root' })
export class MedicoGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  query(queryObject: any): Observable<EntityArrayResponseType> {
    const query = `
      query getAllMedicos($page: Int, $size: Int, $sort: String) {
        getAllMedicos(page: $page, size: $size, sort: $sort, eagerload: true) {
          id
          matricula
          user {
            id
            login
          }
          especialidades {
            id
            nombre
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
        const medicos = response.data.getAllMedicos;
        return new HttpResponse<IMedico[]>({
          body: medicos,
          headers: new HttpHeaders({
            'X-Total-Count': response.data.totalCount || medicos.length.toString(),
          }),
        });
      }),
    );
  }

  create(medico: NewMedico | IMedico): Observable<IMedico> {
    const query = `
        mutation CreateMedico($medicoInput: MedicoInput!) {
          createMedico(medicoInput: $medicoInput) {
            id
            matricula
            user {
              id
              login
            }
            especialidades {
              id
              nombre
              descripcion
            }
          }
        }
      `;

    // Usar el mismo formato que en update
    const variables = {
      medicoInput: {
        matricula: medico.matricula,
        userId: medico.user?.id,
        especialidadesIds: medico.especialidades?.map(esp => esp.id) || [],
      },
    };

    console.log('Enviando creación con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        return response.data.createMedico;
      }),
    );
  }

  update(medico: IMedico): Observable<IMedico> {
    const query = `
      mutation UpdateMedico($id: ID!, $medicoInput: MedicoInput!) {
        updateMedico(id: $id, medicoInput: $medicoInput) {
          id
          matricula
          user {
            id
            login
          }
          especialidades {
            id
            nombre
            descripcion
          }
        }
      }
    `;

    // Asegúrate de que todos los IDs se envíen correctamente
    const variables = {
      id: medico.id,
      medicoInput: {
        id: medico.id,
        matricula: medico.matricula,
        userId: medico.user?.id, // Verifica que esto no sea undefined
        especialidadesIds: medico.especialidades?.map(esp => esp.id) || [],
      },
    };

    console.log('Enviando actualización con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        return response.data.updateMedico;
      }),
    );
  }

  find(id: number): Observable<IMedico> {
    const query = `
      query GetMedicoById($id: ID!) {
        getMedicoById(id: $id) {
          id
          matricula
          user {
            id
            login
          }
          especialidades {
            id
            nombre
            descripcion
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
        return response.data.getMedicoById;
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeleteMedico($id: ID!) {
        deleteMedico(id: $id)
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
          return response.data.deleteMedico;
        }),
      );
  }
}
