import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../historia-clinica.test-samples';

import { HistoriaClinicaFormService } from './historia-clinica-form.service';

describe('HistoriaClinica Form Service', () => {
  let service: HistoriaClinicaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriaClinicaFormService);
  });

  describe('Service methods', () => {
    describe('createHistoriaClinicaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHistoriaClinicaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fecha: expect.any(Object),
            sintomas: expect.any(Object),
            diagnostico: expect.any(Object),
            tratamiento: expect.any(Object),
            hashBlockchain: expect.any(Object),
            paciente: expect.any(Object),
          }),
        );
      });

      it('passing IHistoriaClinica should create a new form with FormGroup', () => {
        const formGroup = service.createHistoriaClinicaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fecha: expect.any(Object),
            sintomas: expect.any(Object),
            diagnostico: expect.any(Object),
            tratamiento: expect.any(Object),
            hashBlockchain: expect.any(Object),
            paciente: expect.any(Object),
          }),
        );
      });
    });

    describe('getHistoriaClinica', () => {
      it('should return NewHistoriaClinica for default HistoriaClinica initial value', () => {
        const formGroup = service.createHistoriaClinicaFormGroup(sampleWithNewData);

        const historiaClinica = service.getHistoriaClinica(formGroup) as any;

        expect(historiaClinica).toMatchObject(sampleWithNewData);
      });

      it('should return NewHistoriaClinica for empty HistoriaClinica initial value', () => {
        const formGroup = service.createHistoriaClinicaFormGroup();

        const historiaClinica = service.getHistoriaClinica(formGroup) as any;

        expect(historiaClinica).toMatchObject({});
      });

      it('should return IHistoriaClinica', () => {
        const formGroup = service.createHistoriaClinicaFormGroup(sampleWithRequiredData);

        const historiaClinica = service.getHistoriaClinica(formGroup) as any;

        expect(historiaClinica).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHistoriaClinica should not enable id FormControl', () => {
        const formGroup = service.createHistoriaClinicaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHistoriaClinica should disable id FormControl', () => {
        const formGroup = service.createHistoriaClinicaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
