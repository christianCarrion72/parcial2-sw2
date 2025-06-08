import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { HorarioAtencionService } from '../service/horario-atencion.service';
import { IHorarioAtencion } from '../horario-atencion.model';
import { HorarioAtencionFormService } from './horario-atencion-form.service';

import { HorarioAtencionUpdateComponent } from './horario-atencion-update.component';

describe('HorarioAtencion Management Update Component', () => {
  let comp: HorarioAtencionUpdateComponent;
  let fixture: ComponentFixture<HorarioAtencionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let horarioAtencionFormService: HorarioAtencionFormService;
  let horarioAtencionService: HorarioAtencionService;
  let medicoService: MedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HorarioAtencionUpdateComponent],
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
      .overrideTemplate(HorarioAtencionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HorarioAtencionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    horarioAtencionFormService = TestBed.inject(HorarioAtencionFormService);
    horarioAtencionService = TestBed.inject(HorarioAtencionService);
    medicoService = TestBed.inject(MedicoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Medico query and add missing value', () => {
      const horarioAtencion: IHorarioAtencion = { id: 9169 };
      const medico: IMedico = { id: 8043 };
      horarioAtencion.medico = medico;

      const medicoCollection: IMedico[] = [{ id: 8043 }];
      jest.spyOn(medicoService, 'query').mockReturnValue(of(new HttpResponse({ body: medicoCollection })));
      const additionalMedicos = [medico];
      const expectedCollection: IMedico[] = [...additionalMedicos, ...medicoCollection];
      jest.spyOn(medicoService, 'addMedicoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ horarioAtencion });
      comp.ngOnInit();

      expect(medicoService.query).toHaveBeenCalled();
      expect(medicoService.addMedicoToCollectionIfMissing).toHaveBeenCalledWith(
        medicoCollection,
        ...additionalMedicos.map(expect.objectContaining),
      );
      expect(comp.medicosSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const horarioAtencion: IHorarioAtencion = { id: 9169 };
      const medico: IMedico = { id: 8043 };
      horarioAtencion.medico = medico;

      activatedRoute.data = of({ horarioAtencion });
      comp.ngOnInit();

      expect(comp.medicosSharedCollection).toContainEqual(medico);
      expect(comp.horarioAtencion).toEqual(horarioAtencion);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHorarioAtencion>>();
      const horarioAtencion = { id: 25186 };
      jest.spyOn(horarioAtencionFormService, 'getHorarioAtencion').mockReturnValue(horarioAtencion);
      jest.spyOn(horarioAtencionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horarioAtencion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horarioAtencion }));
      saveSubject.complete();

      // THEN
      expect(horarioAtencionFormService.getHorarioAtencion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(horarioAtencionService.update).toHaveBeenCalledWith(expect.objectContaining(horarioAtencion));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHorarioAtencion>>();
      const horarioAtencion = { id: 25186 };
      jest.spyOn(horarioAtencionFormService, 'getHorarioAtencion').mockReturnValue({ id: null });
      jest.spyOn(horarioAtencionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horarioAtencion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horarioAtencion }));
      saveSubject.complete();

      // THEN
      expect(horarioAtencionFormService.getHorarioAtencion).toHaveBeenCalled();
      expect(horarioAtencionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHorarioAtencion>>();
      const horarioAtencion = { id: 25186 };
      jest.spyOn(horarioAtencionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horarioAtencion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(horarioAtencionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMedico', () => {
      it('should forward to medicoService', () => {
        const entity = { id: 8043 };
        const entity2 = { id: 19813 };
        jest.spyOn(medicoService, 'compareMedico');
        comp.compareMedico(entity, entity2);
        expect(medicoService.compareMedico).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
