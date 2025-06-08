import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IMedico } from '../medico.model';

@Injectable({ providedIn: 'root' })
export class MedicoGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  create(medico: IMedico): Observable<IMedico> {
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

    const variables = {
      medicoInput: {
        matricula: medico.matricula,
        userId: medico.user?.id,
        especialidadesIds: medico.especialidades?.map(esp => esp.id),
      },
    };

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
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

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(map(response => response.data.getMedicoById));
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeleteMedico($id: ID!) {
        deleteMedico(id: $id)
      }
    `;

    const variables = { id };

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(map(response => response.data.deleteMedico));
  }
}
