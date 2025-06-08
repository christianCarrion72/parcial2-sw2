import dayjs from 'dayjs/esm';

import { IHistoriaClinica, NewHistoriaClinica } from './historia-clinica.model';

export const sampleWithRequiredData: IHistoriaClinica = {
  id: 7584,
  fecha: dayjs('2025-06-07T12:43'),
};

export const sampleWithPartialData: IHistoriaClinica = {
  id: 25853,
  fecha: dayjs('2025-06-07T13:10'),
  sintomas: '../fake-data/blob/hipster.txt',
  tratamiento: 'briskly attend',
  hashBlockchain: 'whoa outrank',
};

export const sampleWithFullData: IHistoriaClinica = {
  id: 26972,
  fecha: dayjs('2025-06-07T02:21'),
  sintomas: '../fake-data/blob/hipster.txt',
  diagnostico: 'signature sit sew',
  tratamiento: 'underplay alive',
  hashBlockchain: 'babyish bathrobe whereas',
};

export const sampleWithNewData: NewHistoriaClinica = {
  fecha: dayjs('2025-06-07T02:32'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
