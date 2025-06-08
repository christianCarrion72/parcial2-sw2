import { IUser } from 'app/entities/user/user.model';
import { IEspecialidad } from 'app/entities/especialidad/especialidad.model';

export interface IMedico {
  id: number;
  matricula?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  especialidades?: Pick<IEspecialidad, 'id'>[] | null;
}

export type NewMedico = Omit<IMedico, 'id'> & { id: null };
