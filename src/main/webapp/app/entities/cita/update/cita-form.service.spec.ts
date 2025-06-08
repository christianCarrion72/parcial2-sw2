import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../cita.test-samples';

import { CitaFormService } from './cita-form.service';

describe('Cita Form Service', () => {
  let service: CitaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaFormService);
  });

  describe('Service methods', () => {
    describe('createCitaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCitaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fechaHora: expect.any(Object),
            estado: expect.any(Object),
            confirmada: expect.any(Object),
            paciente: expect.any(Object),
            medico: expect.any(Object),
            horario: expect.any(Object),
          }),
        );
      });

      it('passing ICita should create a new form with FormGroup', () => {
        const formGroup = service.createCitaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fechaHora: expect.any(Object),
            estado: expect.any(Object),
            confirmada: expect.any(Object),
            paciente: expect.any(Object),
            medico: expect.any(Object),
            horario: expect.any(Object),
          }),
        );
      });
    });

    describe('getCita', () => {
      it('should return NewCita for default Cita initial value', () => {
        const formGroup = service.createCitaFormGroup(sampleWithNewData);

        const cita = service.getCita(formGroup) as any;

        expect(cita).toMatchObject(sampleWithNewData);
      });

      it('should return NewCita for empty Cita initial value', () => {
        const formGroup = service.createCitaFormGroup();

        const cita = service.getCita(formGroup) as any;

        expect(cita).toMatchObject({});
      });

      it('should return ICita', () => {
        const formGroup = service.createCitaFormGroup(sampleWithRequiredData);

        const cita = service.getCita(formGroup) as any;

        expect(cita).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICita should not enable id FormControl', () => {
        const formGroup = service.createCitaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCita should disable id FormControl', () => {
        const formGroup = service.createCitaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
