import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IMedico } from '../medico.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../medico.test-samples';

import { MedicoService } from './medico.service';

const requireRestSample: IMedico = {
  ...sampleWithRequiredData,
};

describe('Medico Service', () => {
  let service: MedicoService;
  let httpMock: HttpTestingController;
  let expectedResult: IMedico | IMedico[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MedicoService);
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

    it('should create a Medico', () => {
      const medico = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(medico).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Medico', () => {
      const medico = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(medico).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Medico', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Medico', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Medico', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMedicoToCollectionIfMissing', () => {
      it('should add a Medico to an empty array', () => {
        const medico: IMedico = sampleWithRequiredData;
        expectedResult = service.addMedicoToCollectionIfMissing([], medico);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medico);
      });

      it('should not add a Medico to an array that contains it', () => {
        const medico: IMedico = sampleWithRequiredData;
        const medicoCollection: IMedico[] = [
          {
            ...medico,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMedicoToCollectionIfMissing(medicoCollection, medico);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Medico to an array that doesn't contain it", () => {
        const medico: IMedico = sampleWithRequiredData;
        const medicoCollection: IMedico[] = [sampleWithPartialData];
        expectedResult = service.addMedicoToCollectionIfMissing(medicoCollection, medico);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medico);
      });

      it('should add only unique Medico to an array', () => {
        const medicoArray: IMedico[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const medicoCollection: IMedico[] = [sampleWithRequiredData];
        expectedResult = service.addMedicoToCollectionIfMissing(medicoCollection, ...medicoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const medico: IMedico = sampleWithRequiredData;
        const medico2: IMedico = sampleWithPartialData;
        expectedResult = service.addMedicoToCollectionIfMissing([], medico, medico2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medico);
        expect(expectedResult).toContain(medico2);
      });

      it('should accept null and undefined values', () => {
        const medico: IMedico = sampleWithRequiredData;
        expectedResult = service.addMedicoToCollectionIfMissing([], null, medico, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medico);
      });

      it('should return initial array if no Medico is added', () => {
        const medicoCollection: IMedico[] = [sampleWithRequiredData];
        expectedResult = service.addMedicoToCollectionIfMissing(medicoCollection, undefined, null);
        expect(expectedResult).toEqual(medicoCollection);
      });
    });

    describe('compareMedico', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMedico(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 8043 };
        const entity2 = null;

        const compareResult1 = service.compareMedico(entity1, entity2);
        const compareResult2 = service.compareMedico(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 8043 };
        const entity2 = { id: 19813 };

        const compareResult1 = service.compareMedico(entity1, entity2);
        const compareResult2 = service.compareMedico(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 8043 };
        const entity2 = { id: 8043 };

        const compareResult1 = service.compareMedico(entity1, entity2);
        const compareResult2 = service.compareMedico(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
