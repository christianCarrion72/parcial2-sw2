import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IPaciente {
  id: number;
  nroHistoriaClinica?: string | null;
  fechaNacimiento?: dayjs.Dayjs | null;
  direccion?: string | null;
  telefono?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewPaciente = Omit<IPaciente, 'id'> & { id: null };
