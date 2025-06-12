import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPaciente, NewPaciente } from '../paciente.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';

// Definir el tipo de respuesta
export type EntityArrayResponseType = HttpResponse<IPaciente[]>;

@Injectable({ providedIn: 'root' })
export class PacienteGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  query(queryObject: any): Observable<EntityArrayResponseType> {
    const query = `
      query getAllPacientes($page: Int, $size: Int, $sort: String) {
        getAllPacientes(page: $page, size: $size, sort: $sort, eagerload: true) {
          id
          nroHistoriaClinica
          fechaNacimiento
          direccion
          telefono
          user {
            id
            login
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
        const pacientes = response.data.getAllPacientes.map((paciente: any) => ({
          ...paciente,
          fechaNacimiento: paciente.fechaNacimiento ? dayjs(paciente.fechaNacimiento) : undefined,
        }));
        return new HttpResponse<IPaciente[]>({
          body: pacientes,
          headers: new HttpHeaders({
            'X-Total-Count': response.data.totalCount || pacientes.length.toString(),
          }),
        });
      }),
    );
  }

  create(paciente: NewPaciente | IPaciente): Observable<IPaciente> {
    const query = `
        mutation CreatePaciente($pacienteInput: PacienteInput!) {
          createPaciente(pacienteInput: $pacienteInput) {
            id
            nroHistoriaClinica
            fechaNacimiento
            direccion
            telefono
            user {
              id
              login
            }
          }
        }
      `;

    const variables = {
      pacienteInput: {
        nroHistoriaClinica: paciente.nroHistoriaClinica,
        fechaNacimiento: paciente.fechaNacimiento?.format(DATE_FORMAT),
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        userId: paciente.user?.id,
      },
    };

    console.log('Enviando creación con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const pacienteResponse = response.data.createPaciente;
        return {
          ...pacienteResponse,
          fechaNacimiento: pacienteResponse.fechaNacimiento ? dayjs(pacienteResponse.fechaNacimiento) : undefined,
        };
      }),
    );
  }

  update(paciente: IPaciente): Observable<IPaciente> {
    const query = `
      mutation UpdatePaciente($id: ID!, $pacienteInput: PacienteInput!) {
        updatePaciente(id: $id, pacienteInput: $pacienteInput) {
          id
          nroHistoriaClinica
          fechaNacimiento
          direccion
          telefono
          user {
            id
            login
          }
        }
      }
    `;

    const variables = {
      id: paciente.id,
      pacienteInput: {
        id: paciente.id,
        nroHistoriaClinica: paciente.nroHistoriaClinica,
        fechaNacimiento: paciente.fechaNacimiento?.format(DATE_FORMAT),
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        userId: paciente.user?.id,
      },
    };

    console.log('Enviando actualización con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const pacienteResponse = response.data.updatePaciente;
        return {
          ...pacienteResponse,
          fechaNacimiento: pacienteResponse.fechaNacimiento ? dayjs(pacienteResponse.fechaNacimiento) : undefined,
        };
      }),
    );
  }

  find(id: number): Observable<IPaciente> {
    const query = `
      query GetPacienteById($id: ID!) {
        getPacienteById(id: $id) {
          id
          nroHistoriaClinica
          fechaNacimiento
          direccion
          telefono
          user {
            id
            login
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
        const paciente = response.data.getPacienteById;
        return {
          ...paciente,
          fechaNacimiento: paciente.fechaNacimiento ? dayjs(paciente.fechaNacimiento) : undefined,
        };
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeletePaciente($id: ID!) {
        deletePaciente(id: $id)
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
          return response.data.deletePaciente;
        }),
      );
  }
}
