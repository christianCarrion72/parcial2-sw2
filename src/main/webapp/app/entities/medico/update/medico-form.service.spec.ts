import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../medico.test-samples';

import { MedicoFormService } from './medico-form.service';

describe('Medico Form Service', () => {
  let service: MedicoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicoFormService);
  });

  describe('Service methods', () => {
    describe('createMedicoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMedicoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            matricula: expect.any(Object),
            user: expect.any(Object),
            especialidades: expect.any(Object),
          }),
        );
      });

      it('passing IMedico should create a new form with FormGroup', () => {
        const formGroup = service.createMedicoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            matricula: expect.any(Object),
            user: expect.any(Object),
            especialidades: expect.any(Object),
          }),
        );
      });
    });

    describe('getMedico', () => {
      it('should return NewMedico for default Medico initial value', () => {
        const formGroup = service.createMedicoFormGroup(sampleWithNewData);

        const medico = service.getMedico(formGroup) as any;

        expect(medico).toMatchObject(sampleWithNewData);
      });

      it('should return NewMedico for empty Medico initial value', () => {
        const formGroup = service.createMedicoFormGroup();

        const medico = service.getMedico(formGroup) as any;

        expect(medico).toMatchObject({});
      });

      it('should return IMedico', () => {
        const formGroup = service.createMedicoFormGroup(sampleWithRequiredData);

        const medico = service.getMedico(formGroup) as any;

        expect(medico).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMedico should not enable id FormControl', () => {
        const formGroup = service.createMedicoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMedico should disable id FormControl', () => {
        const formGroup = service.createMedicoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
