import { IMedico } from 'app/entities/medico/medico.model';
import { DiaSemana } from 'app/entities/enumerations/dia-semana.model';

export interface IHorarioAtencion {
  id: number;
  diaSemana?: keyof typeof DiaSemana | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  medico?: Pick<IMedico, 'id' | 'matricula'> | null;
}

export type NewHorarioAtencion = Omit<IHorarioAtencion, 'id'> & { id: null };
