import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';
import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { IHorarioAtencion } from 'app/entities/horario-atencion/horario-atencion.model';
import { HorarioAtencionService } from 'app/entities/horario-atencion/service/horario-atencion.service';
import { ICita } from '../cita.model';
import { CitaService } from '../service/cita.service';
import { CitaFormService } from './cita-form.service';

import { CitaUpdateComponent } from './cita-update.component';

describe('Cita Management Update Component', () => {
  let comp: CitaUpdateComponent;
  let fixture: ComponentFixture<CitaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let citaFormService: CitaFormService;
  let citaService: CitaService;
  let pacienteService: PacienteService;
  let medicoService: MedicoService;
  let horarioAtencionService: HorarioAtencionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CitaUpdateComponent],
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
      .overrideTemplate(CitaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CitaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    citaFormService = TestBed.inject(CitaFormService);
    citaService = TestBed.inject(CitaService);
    pacienteService = TestBed.inject(PacienteService);
    medicoService = TestBed.inject(MedicoService);
    horarioAtencionService = TestBed.inject(HorarioAtencionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Paciente query and add missing value', () => {
      const cita: ICita = { id: 12445 };
      const paciente: IPaciente = { id: 25847 };
      cita.paciente = paciente;

      const pacienteCollection: IPaciente[] = [{ id: 25847 }];
      jest.spyOn(pacienteService, 'query').mockReturnValue(of(new HttpResponse({ body: pacienteCollection })));
      const additionalPacientes = [paciente];
      const expectedCollection: IPaciente[] = [...additionalPacientes, ...pacienteCollection];
      jest.spyOn(pacienteService, 'addPacienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cita });
      comp.ngOnInit();

      expect(pacienteService.query).toHaveBeenCalled();
      expect(pacienteService.addPacienteToCollectionIfMissing).toHaveBeenCalledWith(
        pacienteCollection,
        ...additionalPacientes.map(expect.objectContaining),
      );
      expect(comp.pacientesSharedCollection).toEqual(expectedCollection);
    });

    it('should call Medico query and add missing value', () => {
      const cita: ICita = { id: 12445 };
      const medico: IMedico = { id: 8043 };
      cita.medico = medico;

      const medicoCollection: IMedico[] = [{ id: 8043 }];
      jest.spyOn(medicoService, 'query').mockReturnValue(of(new HttpResponse({ body: medicoCollection })));
      const additionalMedicos = [medico];
      const expectedCollection: IMedico[] = [...additionalMedicos, ...medicoCollection];
      jest.spyOn(medicoService, 'addMedicoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cita });
      comp.ngOnInit();

      expect(medicoService.query).toHaveBeenCalled();
      expect(medicoService.addMedicoToCollectionIfMissing).toHaveBeenCalledWith(
        medicoCollection,
        ...additionalMedicos.map(expect.objectContaining),
      );
      expect(comp.medicosSharedCollection).toEqual(expectedCollection);
    });

    it('should call HorarioAtencion query and add missing value', () => {
      const cita: ICita = { id: 12445 };
      const horario: IHorarioAtencion = { id: 25186 };
      cita.horario = horario;

      const horarioAtencionCollection: IHorarioAtencion[] = [{ id: 25186 }];
      jest.spyOn(horarioAtencionService, 'query').mockReturnValue(of(new HttpResponse({ body: horarioAtencionCollection })));
      const additionalHorarioAtencions = [horario];
      const expectedCollection: IHorarioAtencion[] = [...additionalHorarioAtencions, ...horarioAtencionCollection];
      jest.spyOn(horarioAtencionService, 'addHorarioAtencionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cita });
      comp.ngOnInit();

      expect(horarioAtencionService.query).toHaveBeenCalled();
      expect(horarioAtencionService.addHorarioAtencionToCollectionIfMissing).toHaveBeenCalledWith(
        horarioAtencionCollection,
        ...additionalHorarioAtencions.map(expect.objectContaining),
      );
      expect(comp.horarioAtencionsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const cita: ICita = { id: 12445 };
      const paciente: IPaciente = { id: 25847 };
      cita.paciente = paciente;
      const medico: IMedico = { id: 8043 };
      cita.medico = medico;
      const horario: IHorarioAtencion = { id: 25186 };
      cita.horario = horario;

      activatedRoute.data = of({ cita });
      comp.ngOnInit();

      expect(comp.pacientesSharedCollection).toContainEqual(paciente);
      expect(comp.medicosSharedCollection).toContainEqual(medico);
      expect(comp.horarioAtencionsSharedCollection).toContainEqual(horario);
      expect(comp.cita).toEqual(cita);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICita>>();
      const cita = { id: 7379 };
      jest.spyOn(citaFormService, 'getCita').mockReturnValue(cita);
      jest.spyOn(citaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cita });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cita }));
      saveSubject.complete();

      // THEN
      expect(citaFormService.getCita).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(citaService.update).toHaveBeenCalledWith(expect.objectContaining(cita));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICita>>();
      const cita = { id: 7379 };
      jest.spyOn(citaFormService, 'getCita').mockReturnValue({ id: null });
      jest.spyOn(citaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cita: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cita }));
      saveSubject.complete();

      // THEN
      expect(citaFormService.getCita).toHaveBeenCalled();
      expect(citaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICita>>();
      const cita = { id: 7379 };
      jest.spyOn(citaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cita });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(citaService.update).toHaveBeenCalled();
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

    describe('compareMedico', () => {
      it('should forward to medicoService', () => {
        const entity = { id: 8043 };
        const entity2 = { id: 19813 };
        jest.spyOn(medicoService, 'compareMedico');
        comp.compareMedico(entity, entity2);
        expect(medicoService.compareMedico).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareHorarioAtencion', () => {
      it('should forward to horarioAtencionService', () => {
        const entity = { id: 25186 };
        const entity2 = { id: 9169 };
        jest.spyOn(horarioAtencionService, 'compareHorarioAtencion');
        comp.compareHorarioAtencion(entity, entity2);
        expect(horarioAtencionService.compareHorarioAtencion).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
