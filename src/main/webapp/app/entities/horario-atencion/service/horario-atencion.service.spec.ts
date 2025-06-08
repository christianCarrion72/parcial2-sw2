import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IHorarioAtencion } from '../horario-atencion.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../horario-atencion.test-samples';

import { HorarioAtencionService } from './horario-atencion.service';

const requireRestSample: IHorarioAtencion = {
  ...sampleWithRequiredData,
};

describe('HorarioAtencion Service', () => {
  let service: HorarioAtencionService;
  let httpMock: HttpTestingController;
  let expectedResult: IHorarioAtencion | IHorarioAtencion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(HorarioAtencionService);
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

    it('should create a HorarioAtencion', () => {
      const horarioAtencion = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(horarioAtencion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HorarioAtencion', () => {
      const horarioAtencion = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(horarioAtencion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HorarioAtencion', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HorarioAtencion', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HorarioAtencion', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHorarioAtencionToCollectionIfMissing', () => {
      it('should add a HorarioAtencion to an empty array', () => {
        const horarioAtencion: IHorarioAtencion = sampleWithRequiredData;
        expectedResult = service.addHorarioAtencionToCollectionIfMissing([], horarioAtencion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(horarioAtencion);
      });

      it('should not add a HorarioAtencion to an array that contains it', () => {
        const horarioAtencion: IHorarioAtencion = sampleWithRequiredData;
        const horarioAtencionCollection: IHorarioAtencion[] = [
          {
            ...horarioAtencion,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHorarioAtencionToCollectionIfMissing(horarioAtencionCollection, horarioAtencion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HorarioAtencion to an array that doesn't contain it", () => {
        const horarioAtencion: IHorarioAtencion = sampleWithRequiredData;
        const horarioAtencionCollection: IHorarioAtencion[] = [sampleWithPartialData];
        expectedResult = service.addHorarioAtencionToCollectionIfMissing(horarioAtencionCollection, horarioAtencion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(horarioAtencion);
      });

      it('should add only unique HorarioAtencion to an array', () => {
        const horarioAtencionArray: IHorarioAtencion[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const horarioAtencionCollection: IHorarioAtencion[] = [sampleWithRequiredData];
        expectedResult = service.addHorarioAtencionToCollectionIfMissing(horarioAtencionCollection, ...horarioAtencionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const horarioAtencion: IHorarioAtencion = sampleWithRequiredData;
        const horarioAtencion2: IHorarioAtencion = sampleWithPartialData;
        expectedResult = service.addHorarioAtencionToCollectionIfMissing([], horarioAtencion, horarioAtencion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(horarioAtencion);
        expect(expectedResult).toContain(horarioAtencion2);
      });

      it('should accept null and undefined values', () => {
        const horarioAtencion: IHorarioAtencion = sampleWithRequiredData;
        expectedResult = service.addHorarioAtencionToCollectionIfMissing([], null, horarioAtencion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(horarioAtencion);
      });

      it('should return initial array if no HorarioAtencion is added', () => {
        const horarioAtencionCollection: IHorarioAtencion[] = [sampleWithRequiredData];
        expectedResult = service.addHorarioAtencionToCollectionIfMissing(horarioAtencionCollection, undefined, null);
        expect(expectedResult).toEqual(horarioAtencionCollection);
      });
    });

    describe('compareHorarioAtencion', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHorarioAtencion(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25186 };
        const entity2 = null;

        const compareResult1 = service.compareHorarioAtencion(entity1, entity2);
        const compareResult2 = service.compareHorarioAtencion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25186 };
        const entity2 = { id: 9169 };

        const compareResult1 = service.compareHorarioAtencion(entity1, entity2);
        const compareResult2 = service.compareHorarioAtencion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25186 };
        const entity2 = { id: 25186 };

        const compareResult1 = service.compareHorarioAtencion(entity1, entity2);
        const compareResult2 = service.compareHorarioAtencion(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
