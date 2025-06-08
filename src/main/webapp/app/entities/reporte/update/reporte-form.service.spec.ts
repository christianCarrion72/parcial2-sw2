import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../reporte.test-samples';

import { ReporteFormService } from './reporte-form.service';

describe('Reporte Form Service', () => {
  let service: ReporteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteFormService);
  });

  describe('Service methods', () => {
    describe('createReporteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReporteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipo: expect.any(Object),
            fechaGeneracion: expect.any(Object),
            rutaArchivo: expect.any(Object),
          }),
        );
      });

      it('passing IReporte should create a new form with FormGroup', () => {
        const formGroup = service.createReporteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipo: expect.any(Object),
            fechaGeneracion: expect.any(Object),
            rutaArchivo: expect.any(Object),
          }),
        );
      });
    });

    describe('getReporte', () => {
      it('should return NewReporte for default Reporte initial value', () => {
        const formGroup = service.createReporteFormGroup(sampleWithNewData);

        const reporte = service.getReporte(formGroup) as any;

        expect(reporte).toMatchObject(sampleWithNewData);
      });

      it('should return NewReporte for empty Reporte initial value', () => {
        const formGroup = service.createReporteFormGroup();

        const reporte = service.getReporte(formGroup) as any;

        expect(reporte).toMatchObject({});
      });

      it('should return IReporte', () => {
        const formGroup = service.createReporteFormGroup(sampleWithRequiredData);

        const reporte = service.getReporte(formGroup) as any;

        expect(reporte).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReporte should not enable id FormControl', () => {
        const formGroup = service.createReporteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReporte should disable id FormControl', () => {
        const formGroup = service.createReporteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
