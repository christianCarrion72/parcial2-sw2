import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IHistoriaClinica } from '../historia-clinica.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../historia-clinica.test-samples';

import { HistoriaClinicaService, RestHistoriaClinica } from './historia-clinica.service';

const requireRestSample: RestHistoriaClinica = {
  ...sampleWithRequiredData,
  fecha: sampleWithRequiredData.fecha?.toJSON(),
};

describe('HistoriaClinica Service', () => {
  let service: HistoriaClinicaService;
  let httpMock: HttpTestingController;
  let expectedResult: IHistoriaClinica | IHistoriaClinica[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(HistoriaClinicaService);
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

    it('should create a HistoriaClinica', () => {
      const historiaClinica = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(historiaClinica).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HistoriaClinica', () => {
      const historiaClinica = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(historiaClinica).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HistoriaClinica', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HistoriaClinica', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HistoriaClinica', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHistoriaClinicaToCollectionIfMissing', () => {
      it('should add a HistoriaClinica to an empty array', () => {
        const historiaClinica: IHistoriaClinica = sampleWithRequiredData;
        expectedResult = service.addHistoriaClinicaToCollectionIfMissing([], historiaClinica);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(historiaClinica);
      });

      it('should not add a HistoriaClinica to an array that contains it', () => {
        const historiaClinica: IHistoriaClinica = sampleWithRequiredData;
        const historiaClinicaCollection: IHistoriaClinica[] = [
          {
            ...historiaClinica,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHistoriaClinicaToCollectionIfMissing(historiaClinicaCollection, historiaClinica);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HistoriaClinica to an array that doesn't contain it", () => {
        const historiaClinica: IHistoriaClinica = sampleWithRequiredData;
        const historiaClinicaCollection: IHistoriaClinica[] = [sampleWithPartialData];
        expectedResult = service.addHistoriaClinicaToCollectionIfMissing(historiaClinicaCollection, historiaClinica);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(historiaClinica);
      });

      it('should add only unique HistoriaClinica to an array', () => {
        const historiaClinicaArray: IHistoriaClinica[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const historiaClinicaCollection: IHistoriaClinica[] = [sampleWithRequiredData];
        expectedResult = service.addHistoriaClinicaToCollectionIfMissing(historiaClinicaCollection, ...historiaClinicaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const historiaClinica: IHistoriaClinica = sampleWithRequiredData;
        const historiaClinica2: IHistoriaClinica = sampleWithPartialData;
        expectedResult = service.addHistoriaClinicaToCollectionIfMissing([], historiaClinica, historiaClinica2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(historiaClinica);
        expect(expectedResult).toContain(historiaClinica2);
      });

      it('should accept null and undefined values', () => {
        const historiaClinica: IHistoriaClinica = sampleWithRequiredData;
        expectedResult = service.addHistoriaClinicaToCollectionIfMissing([], null, historiaClinica, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(historiaClinica);
      });

      it('should return initial array if no HistoriaClinica is added', () => {
        const historiaClinicaCollection: IHistoriaClinica[] = [sampleWithRequiredData];
        expectedResult = service.addHistoriaClinicaToCollectionIfMissing(historiaClinicaCollection, undefined, null);
        expect(expectedResult).toEqual(historiaClinicaCollection);
      });
    });

    describe('compareHistoriaClinica', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHistoriaClinica(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 20252 };
        const entity2 = null;

        const compareResult1 = service.compareHistoriaClinica(entity1, entity2);
        const compareResult2 = service.compareHistoriaClinica(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 20252 };
        const entity2 = { id: 26660 };

        const compareResult1 = service.compareHistoriaClinica(entity1, entity2);
        const compareResult2 = service.compareHistoriaClinica(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 20252 };
        const entity2 = { id: 20252 };

        const compareResult1 = service.compareHistoriaClinica(entity1, entity2);
        const compareResult2 = service.compareHistoriaClinica(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
