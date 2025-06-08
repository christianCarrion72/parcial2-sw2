import dayjs from 'dayjs/esm';
import { IPaciente } from 'app/entities/paciente/paciente.model';

export interface IHistoriaClinica {
  id: number;
  fecha?: dayjs.Dayjs | null;
  sintomas?: string | null;
  diagnostico?: string | null;
  tratamiento?: string | null;
  hashBlockchain?: string | null;
  paciente?: Pick<IPaciente, 'id' | 'nroHistoriaClinica'> | null;
}

export type NewHistoriaClinica = Omit<IHistoriaClinica, 'id'> & { id: null };
