import { IHorarioAtencion, NewHorarioAtencion } from './horario-atencion.model';

export const sampleWithRequiredData: IHorarioAtencion = {
  id: 22614,
  diaSemana: 'LUNES',
  horaInicio: '07:23:00',
  horaFin: '12:57:00',
};

export const sampleWithPartialData: IHorarioAtencion = {
  id: 20044,
  diaSemana: 'VIERNES',
  horaInicio: '04:40:00',
  horaFin: '13:54:00',
};

export const sampleWithFullData: IHorarioAtencion = {
  id: 27552,
  diaSemana: 'JUEVES',
  horaInicio: '04:17:00',
  horaFin: '01:28:00',
};

export const sampleWithNewData: NewHorarioAtencion = {
  diaSemana: 'JUEVES',
  horaInicio: '07:50:00',
  horaFin: '16:04:00',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
