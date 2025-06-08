import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReporte, NewReporte } from '../reporte.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReporte for edit and NewReporteFormGroupInput for create.
 */
type ReporteFormGroupInput = IReporte | PartialWithRequiredKeyOf<NewReporte>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReporte | NewReporte> = Omit<T, 'fechaGeneracion'> & {
  fechaGeneracion?: string | null;
};

type ReporteFormRawValue = FormValueOf<IReporte>;

type NewReporteFormRawValue = FormValueOf<NewReporte>;

type ReporteFormDefaults = Pick<NewReporte, 'id' | 'fechaGeneracion'>;

type ReporteFormGroupContent = {
  id: FormControl<ReporteFormRawValue['id'] | NewReporte['id']>;
  tipo: FormControl<ReporteFormRawValue['tipo']>;
  fechaGeneracion: FormControl<ReporteFormRawValue['fechaGeneracion']>;
  rutaArchivo: FormControl<ReporteFormRawValue['rutaArchivo']>;
};

export type ReporteFormGroup = FormGroup<ReporteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReporteFormService {
  createReporteFormGroup(reporte: ReporteFormGroupInput = { id: null }): ReporteFormGroup {
    const reporteRawValue = this.convertReporteToReporteRawValue({
      ...this.getFormDefaults(),
      ...reporte,
    });
    return new FormGroup<ReporteFormGroupContent>({
      id: new FormControl(
        { value: reporteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      tipo: new FormControl(reporteRawValue.tipo, {
        validators: [Validators.required],
      }),
      fechaGeneracion: new FormControl(reporteRawValue.fechaGeneracion, {
        validators: [Validators.required],
      }),
      rutaArchivo: new FormControl(reporteRawValue.rutaArchivo, {
        validators: [Validators.required],
      }),
    });
  }

  getReporte(form: ReporteFormGroup): IReporte | NewReporte {
    return this.convertReporteRawValueToReporte(form.getRawValue() as ReporteFormRawValue | NewReporteFormRawValue);
  }

  resetForm(form: ReporteFormGroup, reporte: ReporteFormGroupInput): void {
    const reporteRawValue = this.convertReporteToReporteRawValue({ ...this.getFormDefaults(), ...reporte });
    form.reset(
      {
        ...reporteRawValue,
        id: { value: reporteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReporteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaGeneracion: currentTime,
    };
  }

  private convertReporteRawValueToReporte(rawReporte: ReporteFormRawValue | NewReporteFormRawValue): IReporte | NewReporte {
    return {
      ...rawReporte,
      fechaGeneracion: dayjs(rawReporte.fechaGeneracion, DATE_TIME_FORMAT),
    };
  }

  private convertReporteToReporteRawValue(
    reporte: IReporte | (Partial<NewReporte> & ReporteFormDefaults),
  ): ReporteFormRawValue | PartialWithRequiredKeyOf<NewReporteFormRawValue> {
    return {
      ...reporte,
      fechaGeneracion: reporte.fechaGeneracion ? reporte.fechaGeneracion.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
