import dayjs from 'dayjs/esm';

export interface IReporte {
  id: number;
  tipo?: string | null;
  fechaGeneracion?: dayjs.Dayjs | null;
  rutaArchivo?: string | null;
}

export type NewReporte = Omit<IReporte, 'id'> & { id: null };
