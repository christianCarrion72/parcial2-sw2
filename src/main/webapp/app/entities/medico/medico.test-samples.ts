import { IMedico, NewMedico } from './medico.model';

export const sampleWithRequiredData: IMedico = {
  id: 25746,
  matricula: 'dearly',
};

export const sampleWithPartialData: IMedico = {
  id: 24442,
  matricula: 'mystify',
};

export const sampleWithFullData: IMedico = {
  id: 30680,
  matricula: 'concerning',
};

export const sampleWithNewData: NewMedico = {
  matricula: 'sport kookily only',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
