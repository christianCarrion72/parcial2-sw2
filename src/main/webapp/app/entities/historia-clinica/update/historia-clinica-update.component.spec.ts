import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';
import { HistoriaClinicaService } from '../service/historia-clinica.service';
import { IHistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaFormService } from './historia-clinica-form.service';

import { HistoriaClinicaUpdateComponent } from './historia-clinica-update.component';

describe('HistoriaClinica Management Update Component', () => {
  let comp: HistoriaClinicaUpdateComponent;
  let fixture: ComponentFixture<HistoriaClinicaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let historiaClinicaFormService: HistoriaClinicaFormService;
  let historiaClinicaService: HistoriaClinicaService;
  let pacienteService: PacienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HistoriaClinicaUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(HistoriaClinicaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    historiaClinicaFormService = TestBed.inject(HistoriaClinicaFormService);
    historiaClinicaService = TestBed.inject(HistoriaClinicaService);
    pacienteService = TestBed.inject(PacienteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Paciente query and add missing value', () => {
      const historiaClinica: IHistoriaClinica = { id: 26660 };
      const paciente: IPaciente = { id: 25847 };
      historiaClinica.paciente = paciente;

      const pacienteCollection: IPaciente[] = [{ id: 25847 }];
      jest.spyOn(pacienteService, 'query').mockReturnValue(of(new HttpResponse({ body: pacienteCollection })));
      const additionalPacientes = [paciente];
      const expectedCollection: IPaciente[] = [...additionalPacientes, ...pacienteCollection];
      jest.spyOn(pacienteService, 'addPacienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ historiaClinica });
      comp.ngOnInit();

      expect(pacienteService.query).toHaveBeenCalled();
      expect(pacienteService.addPacienteToCollectionIfMissing).toHaveBeenCalledWith(
        pacienteCollection,
        ...additionalPacientes.map(expect.objectContaining),
      );
      expect(comp.pacientesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const historiaClinica: IHistoriaClinica = { id: 26660 };
      const paciente: IPaciente = { id: 25847 };
      historiaClinica.paciente = paciente;

      activatedRoute.data = of({ historiaClinica });
      comp.ngOnInit();

      expect(comp.pacientesSharedCollection).toContainEqual(paciente);
      expect(comp.historiaClinica).toEqual(historiaClinica);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoriaClinica>>();
      const historiaClinica = { id: 20252 };
      jest.spyOn(historiaClinicaFormService, 'getHistoriaClinica').mockReturnValue(historiaClinica);
      jest.spyOn(historiaClinicaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historiaClinica });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historiaClinica }));
      saveSubject.complete();

      // THEN
      expect(historiaClinicaFormService.getHistoriaClinica).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(historiaClinicaService.update).toHaveBeenCalledWith(expect.objectContaining(historiaClinica));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoriaClinica>>();
      const historiaClinica = { id: 20252 };
      jest.spyOn(historiaClinicaFormService, 'getHistoriaClinica').mockReturnValue({ id: null });
      jest.spyOn(historiaClinicaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historiaClinica: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historiaClinica }));
      saveSubject.complete();

      // THEN
      expect(historiaClinicaFormService.getHistoriaClinica).toHaveBeenCalled();
      expect(historiaClinicaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoriaClinica>>();
      const historiaClinica = { id: 20252 };
      jest.spyOn(historiaClinicaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historiaClinica });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(historiaClinicaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePaciente', () => {
      it('should forward to pacienteService', () => {
        const entity = { id: 25847 };
        const entity2 = { id: 1591 };
        jest.spyOn(pacienteService, 'comparePaciente');
        comp.comparePaciente(entity, entity2);
        expect(pacienteService.comparePaciente).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
