import dayjs from 'dayjs/esm';

import { IPaciente, NewPaciente } from './paciente.model';

export const sampleWithRequiredData: IPaciente = {
  id: 25438,
  nroHistoriaClinica: 'despite',
};

export const sampleWithPartialData: IPaciente = {
  id: 18008,
  nroHistoriaClinica: 'afore perfectly',
};

export const sampleWithFullData: IPaciente = {
  id: 160,
  nroHistoriaClinica: 'blind indeed truthfully',
  fechaNacimiento: dayjs('2025-06-07'),
  direccion: 'boohoo towards shudder',
  telefono: 'premise whose worthless',
};

export const sampleWithNewData: NewPaciente = {
  nroHistoriaClinica: 'boo waist minus',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
