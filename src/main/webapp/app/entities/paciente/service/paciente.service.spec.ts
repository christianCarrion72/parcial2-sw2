import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPaciente } from '../paciente.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../paciente.test-samples';

import { PacienteService, RestPaciente } from './paciente.service';

const requireRestSample: RestPaciente = {
  ...sampleWithRequiredData,
  fechaNacimiento: sampleWithRequiredData.fechaNacimiento?.format(DATE_FORMAT),
};

describe('Paciente Service', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;
  let expectedResult: IPaciente | IPaciente[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PacienteService);
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

    it('should create a Paciente', () => {
      const paciente = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(paciente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Paciente', () => {
      const paciente = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(paciente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Paciente', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Paciente', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Paciente', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPacienteToCollectionIfMissing', () => {
      it('should add a Paciente to an empty array', () => {
        const paciente: IPaciente = sampleWithRequiredData;
        expectedResult = service.addPacienteToCollectionIfMissing([], paciente);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paciente);
      });

      it('should not add a Paciente to an array that contains it', () => {
        const paciente: IPaciente = sampleWithRequiredData;
        const pacienteCollection: IPaciente[] = [
          {
            ...paciente,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPacienteToCollectionIfMissing(pacienteCollection, paciente);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Paciente to an array that doesn't contain it", () => {
        const paciente: IPaciente = sampleWithRequiredData;
        const pacienteCollection: IPaciente[] = [sampleWithPartialData];
        expectedResult = service.addPacienteToCollectionIfMissing(pacienteCollection, paciente);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paciente);
      });

      it('should add only unique Paciente to an array', () => {
        const pacienteArray: IPaciente[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pacienteCollection: IPaciente[] = [sampleWithRequiredData];
        expectedResult = service.addPacienteToCollectionIfMissing(pacienteCollection, ...pacienteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paciente: IPaciente = sampleWithRequiredData;
        const paciente2: IPaciente = sampleWithPartialData;
        expectedResult = service.addPacienteToCollectionIfMissing([], paciente, paciente2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paciente);
        expect(expectedResult).toContain(paciente2);
      });

      it('should accept null and undefined values', () => {
        const paciente: IPaciente = sampleWithRequiredData;
        expectedResult = service.addPacienteToCollectionIfMissing([], null, paciente, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paciente);
      });

      it('should return initial array if no Paciente is added', () => {
        const pacienteCollection: IPaciente[] = [sampleWithRequiredData];
        expectedResult = service.addPacienteToCollectionIfMissing(pacienteCollection, undefined, null);
        expect(expectedResult).toEqual(pacienteCollection);
      });
    });

    describe('comparePaciente', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePaciente(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25847 };
        const entity2 = null;

        const compareResult1 = service.comparePaciente(entity1, entity2);
        const compareResult2 = service.comparePaciente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25847 };
        const entity2 = { id: 1591 };

        const compareResult1 = service.comparePaciente(entity1, entity2);
        const compareResult2 = service.comparePaciente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25847 };
        const entity2 = { id: 25847 };

        const compareResult1 = service.comparePaciente(entity1, entity2);
        const compareResult2 = service.comparePaciente(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
