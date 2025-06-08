import dayjs from 'dayjs/esm';

import { ICita, NewCita } from './cita.model';

export const sampleWithRequiredData: ICita = {
  id: 25348,
  fechaHora: dayjs('2025-06-07T14:49'),
  estado: 'PROGRAMADA',
};

export const sampleWithPartialData: ICita = {
  id: 1902,
  fechaHora: dayjs('2025-06-07T07:05'),
  estado: 'CANCELADA',
};

export const sampleWithFullData: ICita = {
  id: 26412,
  fechaHora: dayjs('2025-06-07T14:05'),
  estado: 'PROGRAMADA',
  confirmada: true,
};

export const sampleWithNewData: NewCita = {
  fechaHora: dayjs('2025-06-06T19:23'),
  estado: 'CANCELADA',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
