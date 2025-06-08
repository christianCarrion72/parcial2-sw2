import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../especialidad.test-samples';

import { EspecialidadFormService } from './especialidad-form.service';

describe('Especialidad Form Service', () => {
  let service: EspecialidadFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecialidadFormService);
  });

  describe('Service methods', () => {
    describe('createEspecialidadFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEspecialidadFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            medicos: expect.any(Object),
          }),
        );
      });

      it('passing IEspecialidad should create a new form with FormGroup', () => {
        const formGroup = service.createEspecialidadFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            medicos: expect.any(Object),
          }),
        );
      });
    });

    describe('getEspecialidad', () => {
      it('should return NewEspecialidad for default Especialidad initial value', () => {
        const formGroup = service.createEspecialidadFormGroup(sampleWithNewData);

        const especialidad = service.getEspecialidad(formGroup) as any;

        expect(especialidad).toMatchObject(sampleWithNewData);
      });

      it('should return NewEspecialidad for empty Especialidad initial value', () => {
        const formGroup = service.createEspecialidadFormGroup();

        const especialidad = service.getEspecialidad(formGroup) as any;

        expect(especialidad).toMatchObject({});
      });

      it('should return IEspecialidad', () => {
        const formGroup = service.createEspecialidadFormGroup(sampleWithRequiredData);

        const especialidad = service.getEspecialidad(formGroup) as any;

        expect(especialidad).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEspecialidad should not enable id FormControl', () => {
        const formGroup = service.createEspecialidadFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEspecialidad should disable id FormControl', () => {
        const formGroup = service.createEspecialidadFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
