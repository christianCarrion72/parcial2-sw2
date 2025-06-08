import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IHorarioAtencion, NewHorarioAtencion } from '../horario-atencion.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHorarioAtencion for edit and NewHorarioAtencionFormGroupInput for create.
 */
type HorarioAtencionFormGroupInput = IHorarioAtencion | PartialWithRequiredKeyOf<NewHorarioAtencion>;

type HorarioAtencionFormDefaults = Pick<NewHorarioAtencion, 'id'>;

type HorarioAtencionFormGroupContent = {
  id: FormControl<IHorarioAtencion['id'] | NewHorarioAtencion['id']>;
  diaSemana: FormControl<IHorarioAtencion['diaSemana']>;
  horaInicio: FormControl<IHorarioAtencion['horaInicio']>;
  horaFin: FormControl<IHorarioAtencion['horaFin']>;
  medico: FormControl<IHorarioAtencion['medico']>;
};

export type HorarioAtencionFormGroup = FormGroup<HorarioAtencionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HorarioAtencionFormService {
  createHorarioAtencionFormGroup(horarioAtencion: HorarioAtencionFormGroupInput = { id: null }): HorarioAtencionFormGroup {
    const horarioAtencionRawValue = {
      ...this.getFormDefaults(),
      ...horarioAtencion,
    };
    return new FormGroup<HorarioAtencionFormGroupContent>({
      id: new FormControl(
        { value: horarioAtencionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      diaSemana: new FormControl(horarioAtencionRawValue.diaSemana, {
        validators: [Validators.required],
      }),
      horaInicio: new FormControl(horarioAtencionRawValue.horaInicio, {
        validators: [Validators.required],
      }),
      horaFin: new FormControl(horarioAtencionRawValue.horaFin, {
        validators: [Validators.required],
      }),
      medico: new FormControl(horarioAtencionRawValue.medico),
    });
  }

  getHorarioAtencion(form: HorarioAtencionFormGroup): IHorarioAtencion | NewHorarioAtencion {
    return form.getRawValue() as IHorarioAtencion | NewHorarioAtencion;
  }

  resetForm(form: HorarioAtencionFormGroup, horarioAtencion: HorarioAtencionFormGroupInput): void {
    const horarioAtencionRawValue = { ...this.getFormDefaults(), ...horarioAtencion };
    form.reset(
      {
        ...horarioAtencionRawValue,
        id: { value: horarioAtencionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): HorarioAtencionFormDefaults {
    return {
      id: null,
    };
  }
}
