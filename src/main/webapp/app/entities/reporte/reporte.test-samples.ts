import dayjs from 'dayjs/esm';

import { IReporte, NewReporte } from './reporte.model';

export const sampleWithRequiredData: IReporte = {
  id: 19035,
  tipo: 'vibraphone retool',
  fechaGeneracion: dayjs('2025-06-07T02:05'),
  rutaArchivo: 'burgeon',
};

export const sampleWithPartialData: IReporte = {
  id: 23919,
  tipo: 'seriously',
  fechaGeneracion: dayjs('2025-06-06T19:13'),
  rutaArchivo: 'on waver seemingly',
};

export const sampleWithFullData: IReporte = {
  id: 8410,
  tipo: 'kissingly save',
  fechaGeneracion: dayjs('2025-06-06T20:40'),
  rutaArchivo: 'rigidly',
};

export const sampleWithNewData: NewReporte = {
  tipo: 'outnumber even',
  fechaGeneracion: dayjs('2025-06-07T12:13'),
  rutaArchivo: 'brr meh plugin',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
