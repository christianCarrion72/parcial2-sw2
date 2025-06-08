import dayjs from 'dayjs/esm';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { IMedico } from 'app/entities/medico/medico.model';
import { IHorarioAtencion } from 'app/entities/horario-atencion/horario-atencion.model';
import { EstadoCita } from 'app/entities/enumerations/estado-cita.model';

export interface ICita {
  id: number;
  fechaHora?: dayjs.Dayjs | null;
  estado?: keyof typeof EstadoCita | null;
  confirmada?: boolean | null;
  paciente?: Pick<IPaciente, 'id' | 'nroHistoriaClinica'> | null;
  medico?: Pick<IMedico, 'id' | 'matricula'> | null;
  horario?: Pick<IHorarioAtencion, 'id'> | null;
}

export type NewCita = Omit<ICita, 'id'> & { id: null };
