import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEspecialidad } from '../especialidad.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../especialidad.test-samples';

import { EspecialidadService } from './especialidad.service';

const requireRestSample: IEspecialidad = {
  ...sampleWithRequiredData,
};

describe('Especialidad Service', () => {
  let service: EspecialidadService;
  let httpMock: HttpTestingController;
  let expectedResult: IEspecialidad | IEspecialidad[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EspecialidadService);
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

    it('should create a Especialidad', () => {
      const especialidad = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(especialidad).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Especialidad', () => {
      const especialidad = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(especialidad).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Especialidad', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Especialidad', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Especialidad', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEspecialidadToCollectionIfMissing', () => {
      it('should add a Especialidad to an empty array', () => {
        const especialidad: IEspecialidad = sampleWithRequiredData;
        expectedResult = service.addEspecialidadToCollectionIfMissing([], especialidad);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(especialidad);
      });

      it('should not add a Especialidad to an array that contains it', () => {
        const especialidad: IEspecialidad = sampleWithRequiredData;
        const especialidadCollection: IEspecialidad[] = [
          {
            ...especialidad,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEspecialidadToCollectionIfMissing(especialidadCollection, especialidad);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Especialidad to an array that doesn't contain it", () => {
        const especialidad: IEspecialidad = sampleWithRequiredData;
        const especialidadCollection: IEspecialidad[] = [sampleWithPartialData];
        expectedResult = service.addEspecialidadToCollectionIfMissing(especialidadCollection, especialidad);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(especialidad);
      });

      it('should add only unique Especialidad to an array', () => {
        const especialidadArray: IEspecialidad[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const especialidadCollection: IEspecialidad[] = [sampleWithRequiredData];
        expectedResult = service.addEspecialidadToCollectionIfMissing(especialidadCollection, ...especialidadArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const especialidad: IEspecialidad = sampleWithRequiredData;
        const especialidad2: IEspecialidad = sampleWithPartialData;
        expectedResult = service.addEspecialidadToCollectionIfMissing([], especialidad, especialidad2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(especialidad);
        expect(expectedResult).toContain(especialidad2);
      });

      it('should accept null and undefined values', () => {
        const especialidad: IEspecialidad = sampleWithRequiredData;
        expectedResult = service.addEspecialidadToCollectionIfMissing([], null, especialidad, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(especialidad);
      });

      it('should return initial array if no Especialidad is added', () => {
        const especialidadCollection: IEspecialidad[] = [sampleWithRequiredData];
        expectedResult = service.addEspecialidadToCollectionIfMissing(especialidadCollection, undefined, null);
        expect(expectedResult).toEqual(especialidadCollection);
      });
    });

    describe('compareEspecialidad', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEspecialidad(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 9300 };
        const entity2 = null;

        const compareResult1 = service.compareEspecialidad(entity1, entity2);
        const compareResult2 = service.compareEspecialidad(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 9300 };
        const entity2 = { id: 20529 };

        const compareResult1 = service.compareEspecialidad(entity1, entity2);
        const compareResult2 = service.compareEspecialidad(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 9300 };
        const entity2 = { id: 9300 };

        const compareResult1 = service.compareEspecialidad(entity1, entity2);
        const compareResult2 = service.compareEspecialidad(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
