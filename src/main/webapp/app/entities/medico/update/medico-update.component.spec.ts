import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IEspecialidad } from 'app/entities/especialidad/especialidad.model';
import { EspecialidadService } from 'app/entities/especialidad/service/especialidad.service';
import { IMedico } from '../medico.model';
import { MedicoService } from '../service/medico.service';
import { MedicoFormService } from './medico-form.service';

import { MedicoUpdateComponent } from './medico-update.component';

describe('Medico Management Update Component', () => {
  let comp: MedicoUpdateComponent;
  let fixture: ComponentFixture<MedicoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let medicoFormService: MedicoFormService;
  let medicoService: MedicoService;
  let userService: UserService;
  let especialidadService: EspecialidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MedicoUpdateComponent],
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
      .overrideTemplate(MedicoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medicoFormService = TestBed.inject(MedicoFormService);
    medicoService = TestBed.inject(MedicoService);
    userService = TestBed.inject(UserService);
    especialidadService = TestBed.inject(EspecialidadService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call User query and add missing value', () => {
      const medico: IMedico = { id: 19813 };
      const user: IUser = { id: 3944 };
      medico.user = user;

      const userCollection: IUser[] = [{ id: 3944 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medico });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('should call Especialidad query and add missing value', () => {
      const medico: IMedico = { id: 19813 };
      const especialidades: IEspecialidad[] = [{ id: 9300 }];
      medico.especialidades = especialidades;

      const especialidadCollection: IEspecialidad[] = [{ id: 9300 }];
      jest.spyOn(especialidadService, 'query').mockReturnValue(of(new HttpResponse({ body: especialidadCollection })));
      const additionalEspecialidads = [...especialidades];
      const expectedCollection: IEspecialidad[] = [...additionalEspecialidads, ...especialidadCollection];
      jest.spyOn(especialidadService, 'addEspecialidadToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medico });
      comp.ngOnInit();

      expect(especialidadService.query).toHaveBeenCalled();
      expect(especialidadService.addEspecialidadToCollectionIfMissing).toHaveBeenCalledWith(
        especialidadCollection,
        ...additionalEspecialidads.map(expect.objectContaining),
      );
      expect(comp.especialidadsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const medico: IMedico = { id: 19813 };
      const user: IUser = { id: 3944 };
      medico.user = user;
      const especialidades: IEspecialidad = { id: 9300 };
      medico.especialidades = [especialidades];

      activatedRoute.data = of({ medico });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContainEqual(user);
      expect(comp.especialidadsSharedCollection).toContainEqual(especialidades);
      expect(comp.medico).toEqual(medico);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedico>>();
      const medico = { id: 8043 };
      jest.spyOn(medicoFormService, 'getMedico').mockReturnValue(medico);
      jest.spyOn(medicoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medico });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medico }));
      saveSubject.complete();

      // THEN
      expect(medicoFormService.getMedico).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(medicoService.update).toHaveBeenCalledWith(expect.objectContaining(medico));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedico>>();
      const medico = { id: 8043 };
      jest.spyOn(medicoFormService, 'getMedico').mockReturnValue({ id: null });
      jest.spyOn(medicoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medico: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medico }));
      saveSubject.complete();

      // THEN
      expect(medicoFormService.getMedico).toHaveBeenCalled();
      expect(medicoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedico>>();
      const medico = { id: 8043 };
      jest.spyOn(medicoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medico });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medicoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEspecialidad', () => {
      it('should forward to especialidadService', () => {
        const entity = { id: 9300 };
        const entity2 = { id: 20529 };
        jest.spyOn(especialidadService, 'compareEspecialidad');
        comp.compareEspecialidad(entity, entity2);
        expect(especialidadService.compareEspecialidad).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
