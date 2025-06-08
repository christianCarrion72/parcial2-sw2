import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICita } from '../cita.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../cita.test-samples';

import { CitaService, RestCita } from './cita.service';

const requireRestSample: RestCita = {
  ...sampleWithRequiredData,
  fechaHora: sampleWithRequiredData.fechaHora?.toJSON(),
};

describe('Cita Service', () => {
  let service: CitaService;
  let httpMock: HttpTestingController;
  let expectedResult: ICita | ICita[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CitaService);
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

    it('should create a Cita', () => {
      const cita = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cita).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cita', () => {
      const cita = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cita).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cita', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cita', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cita', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCitaToCollectionIfMissing', () => {
      it('should add a Cita to an empty array', () => {
        const cita: ICita = sampleWithRequiredData;
        expectedResult = service.addCitaToCollectionIfMissing([], cita);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cita);
      });

      it('should not add a Cita to an array that contains it', () => {
        const cita: ICita = sampleWithRequiredData;
        const citaCollection: ICita[] = [
          {
            ...cita,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCitaToCollectionIfMissing(citaCollection, cita);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cita to an array that doesn't contain it", () => {
        const cita: ICita = sampleWithRequiredData;
        const citaCollection: ICita[] = [sampleWithPartialData];
        expectedResult = service.addCitaToCollectionIfMissing(citaCollection, cita);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cita);
      });

      it('should add only unique Cita to an array', () => {
        const citaArray: ICita[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const citaCollection: ICita[] = [sampleWithRequiredData];
        expectedResult = service.addCitaToCollectionIfMissing(citaCollection, ...citaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cita: ICita = sampleWithRequiredData;
        const cita2: ICita = sampleWithPartialData;
        expectedResult = service.addCitaToCollectionIfMissing([], cita, cita2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cita);
        expect(expectedResult).toContain(cita2);
      });

      it('should accept null and undefined values', () => {
        const cita: ICita = sampleWithRequiredData;
        expectedResult = service.addCitaToCollectionIfMissing([], null, cita, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cita);
      });

      it('should return initial array if no Cita is added', () => {
        const citaCollection: ICita[] = [sampleWithRequiredData];
        expectedResult = service.addCitaToCollectionIfMissing(citaCollection, undefined, null);
        expect(expectedResult).toEqual(citaCollection);
      });
    });

    describe('compareCita', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCita(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 7379 };
        const entity2 = null;

        const compareResult1 = service.compareCita(entity1, entity2);
        const compareResult2 = service.compareCita(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 7379 };
        const entity2 = { id: 12445 };

        const compareResult1 = service.compareCita(entity1, entity2);
        const compareResult2 = service.compareCita(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 7379 };
        const entity2 = { id: 7379 };

        const compareResult1 = service.compareCita(entity1, entity2);
        const compareResult2 = service.compareCita(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
