import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { EspecialidadService } from '../service/especialidad.service';
import { IEspecialidad } from '../especialidad.model';
import { EspecialidadFormService } from './especialidad-form.service';

import { EspecialidadUpdateComponent } from './especialidad-update.component';

describe('Especialidad Management Update Component', () => {
  let comp: EspecialidadUpdateComponent;
  let fixture: ComponentFixture<EspecialidadUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let especialidadFormService: EspecialidadFormService;
  let especialidadService: EspecialidadService;
  let medicoService: MedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EspecialidadUpdateComponent],
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
      .overrideTemplate(EspecialidadUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EspecialidadUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    especialidadFormService = TestBed.inject(EspecialidadFormService);
    especialidadService = TestBed.inject(EspecialidadService);
    medicoService = TestBed.inject(MedicoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Medico query and add missing value', () => {
      const especialidad: IEspecialidad = { id: 20529 };
      const medicos: IMedico[] = [{ id: 8043 }];
      especialidad.medicos = medicos;

      const medicoCollection: IMedico[] = [{ id: 8043 }];
      jest.spyOn(medicoService, 'query').mockReturnValue(of(new HttpResponse({ body: medicoCollection })));
      const additionalMedicos = [...medicos];
      const expectedCollection: IMedico[] = [...additionalMedicos, ...medicoCollection];
      jest.spyOn(medicoService, 'addMedicoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ especialidad });
      comp.ngOnInit();

      expect(medicoService.query).toHaveBeenCalled();
      expect(medicoService.addMedicoToCollectionIfMissing).toHaveBeenCalledWith(
        medicoCollection,
        ...additionalMedicos.map(expect.objectContaining),
      );
      expect(comp.medicosSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const especialidad: IEspecialidad = { id: 20529 };
      const medicos: IMedico = { id: 8043 };
      especialidad.medicos = [medicos];

      activatedRoute.data = of({ especialidad });
      comp.ngOnInit();

      expect(comp.medicosSharedCollection).toContainEqual(medicos);
      expect(comp.especialidad).toEqual(especialidad);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEspecialidad>>();
      const especialidad = { id: 9300 };
      jest.spyOn(especialidadFormService, 'getEspecialidad').mockReturnValue(especialidad);
      jest.spyOn(especialidadService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ especialidad });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: especialidad }));
      saveSubject.complete();

      // THEN
      expect(especialidadFormService.getEspecialidad).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(especialidadService.update).toHaveBeenCalledWith(expect.objectContaining(especialidad));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEspecialidad>>();
      const especialidad = { id: 9300 };
      jest.spyOn(especialidadFormService, 'getEspecialidad').mockReturnValue({ id: null });
      jest.spyOn(especialidadService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ especialidad: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: especialidad }));
      saveSubject.complete();

      // THEN
      expect(especialidadFormService.getEspecialidad).toHaveBeenCalled();
      expect(especialidadService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEspecialidad>>();
      const especialidad = { id: 9300 };
      jest.spyOn(especialidadService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ especialidad });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(especialidadService.update).toHaveBeenCalled();
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
