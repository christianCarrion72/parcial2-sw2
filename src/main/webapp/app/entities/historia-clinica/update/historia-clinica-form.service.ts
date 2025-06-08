import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHistoriaClinica, NewHistoriaClinica } from '../historia-clinica.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHistoriaClinica for edit and NewHistoriaClinicaFormGroupInput for create.
 */
type HistoriaClinicaFormGroupInput = IHistoriaClinica | PartialWithRequiredKeyOf<NewHistoriaClinica>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IHistoriaClinica | NewHistoriaClinica> = Omit<T, 'fecha'> & {
  fecha?: string | null;
};

type HistoriaClinicaFormRawValue = FormValueOf<IHistoriaClinica>;

type NewHistoriaClinicaFormRawValue = FormValueOf<NewHistoriaClinica>;

type HistoriaClinicaFormDefaults = Pick<NewHistoriaClinica, 'id' | 'fecha'>;

type HistoriaClinicaFormGroupContent = {
  id: FormControl<HistoriaClinicaFormRawValue['id'] | NewHistoriaClinica['id']>;
  fecha: FormControl<HistoriaClinicaFormRawValue['fecha']>;
  sintomas: FormControl<HistoriaClinicaFormRawValue['sintomas']>;
  diagnostico: FormControl<HistoriaClinicaFormRawValue['diagnostico']>;
  tratamiento: FormControl<HistoriaClinicaFormRawValue['tratamiento']>;
  hashBlockchain: FormControl<HistoriaClinicaFormRawValue['hashBlockchain']>;
  paciente: FormControl<HistoriaClinicaFormRawValue['paciente']>;
};

export type HistoriaClinicaFormGroup = FormGroup<HistoriaClinicaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaFormService {
  createHistoriaClinicaFormGroup(historiaClinica: HistoriaClinicaFormGroupInput = { id: null }): HistoriaClinicaFormGroup {
    const historiaClinicaRawValue = this.convertHistoriaClinicaToHistoriaClinicaRawValue({
      ...this.getFormDefaults(),
      ...historiaClinica,
    });
    return new FormGroup<HistoriaClinicaFormGroupContent>({
      id: new FormControl(
        { value: historiaClinicaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fecha: new FormControl(historiaClinicaRawValue.fecha, {
        validators: [Validators.required],
      }),
      sintomas: new FormControl(historiaClinicaRawValue.sintomas),
      diagnostico: new FormControl(historiaClinicaRawValue.diagnostico),
      tratamiento: new FormControl(historiaClinicaRawValue.tratamiento),
      hashBlockchain: new FormControl(historiaClinicaRawValue.hashBlockchain),
      paciente: new FormControl(historiaClinicaRawValue.paciente),
    });
  }

  getHistoriaClinica(form: HistoriaClinicaFormGroup): IHistoriaClinica | NewHistoriaClinica {
    return this.convertHistoriaClinicaRawValueToHistoriaClinica(
      form.getRawValue() as HistoriaClinicaFormRawValue | NewHistoriaClinicaFormRawValue,
    );
  }

  resetForm(form: HistoriaClinicaFormGroup, historiaClinica: HistoriaClinicaFormGroupInput): void {
    const historiaClinicaRawValue = this.convertHistoriaClinicaToHistoriaClinicaRawValue({ ...this.getFormDefaults(), ...historiaClinica });
    form.reset(
      {
        ...historiaClinicaRawValue,
        id: { value: historiaClinicaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): HistoriaClinicaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fecha: currentTime,
    };
  }

  private convertHistoriaClinicaRawValueToHistoriaClinica(
    rawHistoriaClinica: HistoriaClinicaFormRawValue | NewHistoriaClinicaFormRawValue,
  ): IHistoriaClinica | NewHistoriaClinica {
    return {
      ...rawHistoriaClinica,
      fecha: dayjs(rawHistoriaClinica.fecha, DATE_TIME_FORMAT),
    };
  }

  private convertHistoriaClinicaToHistoriaClinicaRawValue(
    historiaClinica: IHistoriaClinica | (Partial<NewHistoriaClinica> & HistoriaClinicaFormDefaults),
  ): HistoriaClinicaFormRawValue | PartialWithRequiredKeyOf<NewHistoriaClinicaFormRawValue> {
    return {
      ...historiaClinica,
      fecha: historiaClinica.fecha ? historiaClinica.fecha.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
