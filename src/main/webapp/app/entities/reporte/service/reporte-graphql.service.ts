import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IReporte, NewReporte } from '../reporte.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';

// Definir el tipo de respuesta
export type EntityArrayResponseType = HttpResponse<IReporte[]>;

@Injectable({ providedIn: 'root' })
export class ReporteGraphQLService {
  private graphqlUrl = 'api/graphql';

  constructor(private http: HttpClient) {}

  query(queryObject: any): Observable<EntityArrayResponseType> {
    const query = `
      query getAllReportes($page: Int, $size: Int, $sort: String) {
        getAllReportes(page: $page, size: $size, sort: $sort) {
          id
          tipo
          fechaGeneracion
          rutaArchivo
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
        const reportes = response.data.getAllReportes.map((reporte: any) => {
          // Verificar si la fecha es válida antes de convertirla
          let fechaGeneracion;
          try {
            // Procesar la fecha con formato de zona horaria
            if (reporte.fechaGeneracion) {
              // Extraer la parte de la fecha sin la zona horaria entre corchetes
              const fechaStr = reporte.fechaGeneracion.split('[')[0];
              fechaGeneracion = dayjs(fechaStr);
              console.log(`Fecha procesada para reporte ${reporte.id}: ${fechaStr} -> ${fechaGeneracion.format('YYYY-MM-DD HH:mm:ss')}`);

              if (!fechaGeneracion.isValid()) {
                console.warn(`Fecha inválida recibida para reporte ${reporte.id}: ${reporte.fechaGeneracion}`);
                fechaGeneracion = undefined;
              }
            } else {
              fechaGeneracion = undefined;
            }
          } catch (error) {
            console.error(`Error al procesar fecha para reporte ${reporte.id}:`, error);
            fechaGeneracion = undefined;
          }

          return {
            ...reporte,
            fechaGeneracion,
          };
        });
        return new HttpResponse<IReporte[]>({
          body: reportes,
          headers: new HttpHeaders({
            'X-Total-Count': response.data.totalCount || reportes.length.toString(),
          }),
        });
      }),
    );
  }

  create(reporte: NewReporte | IReporte): Observable<IReporte> {
    const query = `
        mutation CreateReporte($reporteInput: ReporteInput!) {
          createReporte(reporteInput: $reporteInput) {
            id
            tipo
            fechaGeneracion
            rutaArchivo
          }
        }
      `;

    const variables = {
      reporteInput: {
        tipo: reporte.tipo,
        fechaGeneracion: reporte.fechaGeneracion?.format(DATE_TIME_FORMAT) + 'Z',
        rutaArchivo: reporte.rutaArchivo,
      },
    };

    console.log('Enviando creación con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const reporteResponse = response.data.createReporte;
        return {
          ...reporteResponse,
          fechaGeneracion: reporteResponse.fechaGeneracion ? dayjs(reporteResponse.fechaGeneracion) : undefined,
        };
      }),
    );
  }

  update(reporte: IReporte): Observable<IReporte> {
    const query = `
      mutation UpdateReporte($id: ID!, $reporteInput: ReporteInput!) {
        updateReporte(id: $id, reporteInput: $reporteInput) {
          id
          tipo
          fechaGeneracion
          rutaArchivo
        }
      }
    `;

    const variables = {
      id: reporte.id,
      reporteInput: {
        id: reporte.id,
        tipo: reporte.tipo,
        fechaGeneracion: reporte.fechaGeneracion?.format(DATE_TIME_FORMAT) + 'Z',
        rutaArchivo: reporte.rutaArchivo,
      },
    };

    console.log('Enviando actualización con variables:', JSON.stringify(variables));

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          console.error('Error en GraphQL:', response.errors);
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const reporteResponse = response.data.updateReporte;
        return {
          ...reporteResponse,
          fechaGeneracion: reporteResponse.fechaGeneracion ? dayjs(reporteResponse.fechaGeneracion) : undefined,
        };
      }),
    );
  }

  find(id: number): Observable<IReporte> {
    const query = `
      query GetReporteById($id: ID!) {
        getReporteById(id: $id) {
          id
          tipo
          fechaGeneracion
          rutaArchivo
        }
      }
    `;

    const variables = { id };

    return this.http.post<any>(this.graphqlUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error('GraphQL Error: ' + JSON.stringify(response.errors));
        }
        const reporte = response.data.getReporteById;
        return {
          ...reporte,
          fechaGeneracion: reporte.fechaGeneracion ? dayjs(reporte.fechaGeneracion) : undefined,
        };
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const query = `
      mutation DeleteReporte($id: ID!) {
        deleteReporte(id: $id)
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
          return response.data.deleteReporte;
        }),
      );
  }
}
