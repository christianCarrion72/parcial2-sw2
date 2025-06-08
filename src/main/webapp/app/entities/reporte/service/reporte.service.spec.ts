import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IReporte } from '../reporte.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../reporte.test-samples';

import { ReporteService, RestReporte } from './reporte.service';

const requireRestSample: RestReporte = {
  ...sampleWithRequiredData,
  fechaGeneracion: sampleWithRequiredData.fechaGeneracion?.toJSON(),
};

describe('Reporte Service', () => {
  let service: ReporteService;
  let httpMock: HttpTestingController;
  let expectedResult: IReporte | IReporte[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ReporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Reporte', () => {
      const reporte = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reporte).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reporte', () => {
      const reporte = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reporte).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reporte', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reporte', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Reporte', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReporteToCollectionIfMissing', () => {
      it('should add a Reporte to an empty array', () => {
        const reporte: IReporte = sampleWithRequiredData;
        expectedResult = service.addReporteToCollectionIfMissing([], reporte);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reporte);
      });

      it('should not add a Reporte to an array that contains it', () => {
        const reporte: IReporte = sampleWithRequiredData;
        const reporteCollection: IReporte[] = [
          {
            ...reporte,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, reporte);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reporte to an array that doesn't contain it", () => {
        const reporte: IReporte = sampleWithRequiredData;
        const reporteCollection: IReporte[] = [sampleWithPartialData];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, reporte);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reporte);
      });

      it('should add only unique Reporte to an array', () => {
        const reporteArray: IReporte[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reporteCollection: IReporte[] = [sampleWithRequiredData];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, ...reporteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reporte: IReporte = sampleWithRequiredData;
        const reporte2: IReporte = sampleWithPartialData;
        expectedResult = service.addReporteToCollectionIfMissing([], reporte, reporte2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reporte);
        expect(expectedResult).toContain(reporte2);
      });

      it('should accept null and undefined values', () => {
        const reporte: IReporte = sampleWithRequiredData;
        expectedResult = service.addReporteToCollectionIfMissing([], null, reporte, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reporte);
      });

      it('should return initial array if no Reporte is added', () => {
        const reporteCollection: IReporte[] = [sampleWithRequiredData];
        expectedResult = service.addReporteToCollectionIfMissing(reporteCollection, undefined, null);
        expect(expectedResult).toEqual(reporteCollection);
      });
    });

    describe('compareReporte', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReporte(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 30486 };
        const entity2 = null;

        const compareResult1 = service.compareReporte(entity1, entity2);
        const compareResult2 = service.compareReporte(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 30486 };
        const entity2 = { id: 10354 };

        const compareResult1 = service.compareReporte(entity1, entity2);
        const compareResult2 = service.compareReporte(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 30486 };
        const entity2 = { id: 30486 };

        const compareResult1 = service.compareReporte(entity1, entity2);
        const compareResult2 = service.compareReporte(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
