import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICita, NewCita } from '../cita.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICita for edit and NewCitaFormGroupInput for create.
 */
type CitaFormGroupInput = ICita | PartialWithRequiredKeyOf<NewCita>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICita | NewCita> = Omit<T, 'fechaHora'> & {
  fechaHora?: string | null;
};

type CitaFormRawValue = FormValueOf<ICita>;

type NewCitaFormRawValue = FormValueOf<NewCita>;

type CitaFormDefaults = Pick<NewCita, 'id' | 'fechaHora' | 'confirmada'>;

type CitaFormGroupContent = {
  id: FormControl<CitaFormRawValue['id'] | NewCita['id']>;
  fechaHora: FormControl<CitaFormRawValue['fechaHora']>;
  estado: FormControl<CitaFormRawValue['estado']>;
  confirmada: FormControl<CitaFormRawValue['confirmada']>;
  paciente: FormControl<CitaFormRawValue['paciente']>;
  medico: FormControl<CitaFormRawValue['medico']>;
  horario: FormControl<CitaFormRawValue['horario']>;
};

export type CitaFormGroup = FormGroup<CitaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CitaFormService {
  createCitaFormGroup(cita: CitaFormGroupInput = { id: null }): CitaFormGroup {
    const citaRawValue = this.convertCitaToCitaRawValue({
      ...this.getFormDefaults(),
      ...cita,
    });
    return new FormGroup<CitaFormGroupContent>({
      id: new FormControl(
        { value: citaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fechaHora: new FormControl(citaRawValue.fechaHora, {
        validators: [Validators.required],
      }),
      estado: new FormControl(citaRawValue.estado, {
        validators: [Validators.required],
      }),
      confirmada: new FormControl(citaRawValue.confirmada),
      paciente: new FormControl(citaRawValue.paciente),
      medico: new FormControl(citaRawValue.medico),
      horario: new FormControl(citaRawValue.horario),
    });
  }

  getCita(form: CitaFormGroup): ICita | NewCita {
    return this.convertCitaRawValueToCita(form.getRawValue() as CitaFormRawValue | NewCitaFormRawValue);
  }

  resetForm(form: CitaFormGroup, cita: CitaFormGroupInput): void {
    const citaRawValue = this.convertCitaToCitaRawValue({ ...this.getFormDefaults(), ...cita });
    form.reset(
      {
        ...citaRawValue,
        id: { value: citaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CitaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaHora: currentTime,
      confirmada: false,
    };
  }

  private convertCitaRawValueToCita(rawCita: CitaFormRawValue | NewCitaFormRawValue): ICita | NewCita {
    return {
      ...rawCita,
      fechaHora: dayjs(rawCita.fechaHora, DATE_TIME_FORMAT),
    };
  }

  private convertCitaToCitaRawValue(
    cita: ICita | (Partial<NewCita> & CitaFormDefaults),
  ): CitaFormRawValue | PartialWithRequiredKeyOf<NewCitaFormRawValue> {
    return {
      ...cita,
      fechaHora: cita.fechaHora ? cita.fechaHora.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
