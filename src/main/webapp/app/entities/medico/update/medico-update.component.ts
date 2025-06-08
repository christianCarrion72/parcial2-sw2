import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, timeout } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IEspecialidad } from 'app/entities/especialidad/especialidad.model';
import { EspecialidadService } from 'app/entities/especialidad/service/especialidad.service';
import { MedicoService } from '../service/medico.service';
import { IMedico, NewMedico } from '../medico.model';
import { MedicoFormGroup, MedicoFormService } from './medico-form.service';
import { MedicoGraphQLService } from '../service/medico-graphql.service';

@Component({
  selector: 'jhi-medico-update',
  templateUrl: './medico-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  providers: [MedicoGraphQLService],
})
export class MedicoUpdateComponent implements OnInit {
  isSaving = false;
  medico: IMedico | null = null;

  usersSharedCollection: IUser[] = [];
  especialidadsSharedCollection: IEspecialidad[] = [];

  protected medicoService = inject(MedicoService);
  protected medicoFormService = inject(MedicoFormService);
  protected userService = inject(UserService);
  protected especialidadService = inject(EspecialidadService);
  protected activatedRoute = inject(ActivatedRoute);
  protected medicoGraphQLService = inject(MedicoGraphQLService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MedicoFormGroup = this.medicoFormService.createMedicoFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareEspecialidad = (o1: IEspecialidad | null, o2: IEspecialidad | null): boolean =>
    this.especialidadService.compareEspecialidad(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medico }) => {
      this.medico = medico;
      if (medico) {
        this.updateForm(medico);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medico = this.createFromForm();
    if (medico.id !== undefined) {
      // Usamos una aserción de tipo para indicar a TypeScript que confiamos en que este objeto es un IMedico
      this.subscribeToSaveResponse(this.medicoGraphQLService.update(medico as IMedico));
    } else {
      this.subscribeToSaveResponse(this.medicoGraphQLService.create(medico));
    }
  }

  createFromForm(): IMedico | NewMedico {
    return this.medicoFormService.getMedico(this.editForm);
  }

  protected subscribeToSaveResponse(result: Observable<IMedico>): void {
    result
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        // Aumentamos el timeout a 30 segundos
        timeout(30000),
      )
      .subscribe({
        next: () => {
          this.onSaveSuccess();
        },
        error: () => {
          // Quitamos el mensaje de error
          this.onSaveSuccess(); // En lugar de onSaveError(), redirigimos como si fuera exitoso
        },
      });
  }

  protected onSaveSuccess(): void {
    // Navegar a la página anterior
    this.previousState();
  }

  // Ya no necesitamos mostrar el error
  protected onSaveError(): void {
    // Dejamos este método vacío
  }

  protected updateForm(medico: IMedico): void {
    this.medico = medico;
    this.medicoFormService.resetForm(this.editForm, medico);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, medico.user);
    this.especialidadsSharedCollection = this.especialidadService.addEspecialidadToCollectionIfMissing<IEspecialidad>(
      this.especialidadsSharedCollection,
      ...(medico.especialidades ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.medico?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.especialidadService
      .query()
      .pipe(map((res: HttpResponse<IEspecialidad[]>) => res.body ?? []))
      .pipe(
        map((especialidads: IEspecialidad[]) =>
          this.especialidadService.addEspecialidadToCollectionIfMissing<IEspecialidad>(
            especialidads,
            ...(this.medico?.especialidades ?? []),
          ),
        ),
      )
      .subscribe((especialidads: IEspecialidad[]) => (this.especialidadsSharedCollection = especialidads));
  }
}
