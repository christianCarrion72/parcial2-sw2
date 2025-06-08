import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../horario-atencion.test-samples';

import { HorarioAtencionFormService } from './horario-atencion-form.service';

describe('HorarioAtencion Form Service', () => {
  let service: HorarioAtencionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioAtencionFormService);
  });

  describe('Service methods', () => {
    describe('createHorarioAtencionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHorarioAtencionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            diaSemana: expect.any(Object),
            horaInicio: expect.any(Object),
            horaFin: expect.any(Object),
            medico: expect.any(Object),
          }),
        );
      });

      it('passing IHorarioAtencion should create a new form with FormGroup', () => {
        const formGroup = service.createHorarioAtencionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            diaSemana: expect.any(Object),
            horaInicio: expect.any(Object),
            horaFin: expect.any(Object),
            medico: expect.any(Object),
          }),
        );
      });
    });

    describe('getHorarioAtencion', () => {
      it('should return NewHorarioAtencion for default HorarioAtencion initial value', () => {
        const formGroup = service.createHorarioAtencionFormGroup(sampleWithNewData);

        const horarioAtencion = service.getHorarioAtencion(formGroup) as any;

        expect(horarioAtencion).toMatchObject(sampleWithNewData);
      });

      it('should return NewHorarioAtencion for empty HorarioAtencion initial value', () => {
        const formGroup = service.createHorarioAtencionFormGroup();

        const horarioAtencion = service.getHorarioAtencion(formGroup) as any;

        expect(horarioAtencion).toMatchObject({});
      });

      it('should return IHorarioAtencion', () => {
        const formGroup = service.createHorarioAtencionFormGroup(sampleWithRequiredData);

        const horarioAtencion = service.getHorarioAtencion(formGroup) as any;

        expect(horarioAtencion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHorarioAtencion should not enable id FormControl', () => {
        const formGroup = service.createHorarioAtencionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHorarioAtencion should disable id FormControl', () => {
        const formGroup = service.createHorarioAtencionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
