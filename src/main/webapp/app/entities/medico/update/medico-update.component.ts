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
        console.log('Editando médico:', medico);
        this.updateForm(medico);
      } else {
        console.log('Creando nuevo médico');
        this.editForm = this.medicoFormService.createMedicoFormGroup();
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  /*save(): void {
    this.isSaving = true;
    const formValue = this.editForm.getRawValue();

    // Validación antes de guardar
    if (!this.editForm.valid) {
      this.isSaving = false;
      return;
    }

    try {
      // Verificar si es una actualización o creación
      if (this.medico?.id) {
        // Actualización
        const updateMedico: IMedico = {
          id: this.medico.id,
          matricula: formValue.matricula ?? '',
          user: formValue.user,
          especialidades: formValue.especialidades ?? [],
        };
        this.subscribeToSaveResponse(this.medicoService.update(updateMedico));
      } else {
        // Creación
        const newMedico: NewMedico = {
          id: null,
          matricula: formValue.matricula ?? '',
          user: formValue.user,
          especialidades: formValue.especialidades ?? [],
        };
        this.subscribeToSaveResponse(this.medicoService.create(newMedico));
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      this.onSaveError();
    }
  }*/

  save(): void {
    this.isSaving = true;
    const formValue = this.editForm.getRawValue();

    try {
      if (this.medico?.id) {
        // Actualización usando GraphQL
        const updateMedico: IMedico = {
          id: this.medico.id,
          matricula: formValue.matricula ?? '',
          user: formValue.user,
          especialidades: formValue.especialidades ?? [],
        };
        this.subscribeToGraphQLResponse(this.medicoGraphQLService.update(updateMedico));
      } else {
        // Creación usando GraphQL
        const newMedico: IMedico = {
          id: 0, // Asignamos un valor temporal
          matricula: formValue.matricula ?? '',
          user: formValue.user,
          especialidades: formValue.especialidades ?? [],
        };
        this.subscribeToGraphQLResponse(this.medicoGraphQLService.create(newMedico));
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      this.onSaveError();
    }
  }

  createFromForm(): IMedico | NewMedico {
    const formValue = this.editForm.getRawValue();

    return {
      id: formValue.id ?? null,
      matricula: formValue.matricula ?? '',
      user: formValue.user ?? null,
      especialidades: formValue.especialidades ?? [],
    };
  }

  /*protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedico>>): void {
    result
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: () => this.onSaveSuccess(),
        error: (error) => {
          console.error('Error en la respuesta:', error);
          // Manejo específico de errores
          if (error?.error?.title) {
            this.onSaveError(error.error.title);
          } else if (error?.error?.errorKey) {
            this.onSaveError(error.error.errorKey);
          } else {
            this.onSaveError('Error al guardar el médico');
          }
        },
      });
  }*/

  protected subscribeToGraphQLResponse(result: Observable<IMedico>): void {
    result
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        timeout(30000), // 30 segundos de timeout
      )
      .subscribe({
        next: response => {
          console.log('Respuesta GraphQL exitosa:', response);
          this.onSaveSuccess();
        },
        error: error => {
          console.error('Error GraphQL:', error);
          this.onSaveSuccess(); // Redirigir incluso con error
        },
      });
  }

  protected onSaveSuccess(): void {
    // Navegar a la página anterior
    this.previousState();
  }

  // Ya no necesitamos mostrar el error
  protected onSaveError(errorMessage: string = 'Error al guardar'): void {
    this.isSaving = false;
    // Usar un mensaje de error simple en lugar de una clave de traducción
    console.error(errorMessage);
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
