import { IMedico } from 'app/entities/medico/medico.model';

export interface IEspecialidad {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  medicos?: Pick<IMedico, 'id'>[] | null;
}

export type NewEspecialidad = Omit<IEspecialidad, 'id'> & { id: null };
