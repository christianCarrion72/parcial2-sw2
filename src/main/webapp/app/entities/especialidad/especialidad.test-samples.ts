import { IEspecialidad, NewEspecialidad } from './especialidad.model';

export const sampleWithRequiredData: IEspecialidad = {
  id: 10308,
  nombre: 'stormy unless milestone',
};

export const sampleWithPartialData: IEspecialidad = {
  id: 814,
  nombre: 'gee fit',
  descripcion: 'underpants failing',
};

export const sampleWithFullData: IEspecialidad = {
  id: 13127,
  nombre: 'that break',
  descripcion: 'openly incidentally',
};

export const sampleWithNewData: NewEspecialidad = {
  nombre: 'whereas cheerfully yowza',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
