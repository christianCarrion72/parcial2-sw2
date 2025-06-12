import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, timeout } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IPaciente } from '../paciente.model';
import { PacienteService } from '../service/paciente.service';
import { PacienteFormGroup, PacienteFormService } from './paciente-form.service';
import { PacienteGraphQLService } from '../service/paciente-graphql.service';

@Component({
  selector: 'jhi-paciente-update',
  templateUrl: './paciente-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PacienteUpdateComponent implements OnInit {
  isSaving = false;
  paciente: IPaciente | null = null;

  usersSharedCollection: IUser[] = [];

  protected pacienteService = inject(PacienteService);
  protected pacienteFormService = inject(PacienteFormService);
  protected pacienteGraphQLService = inject(PacienteGraphQLService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PacienteFormGroup = this.pacienteFormService.createPacienteFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paciente }) => {
      this.paciente = paciente;
      if (paciente) {
        console.log('Editando paciente:', paciente);
        this.updateForm(paciente);
      } else {
        console.log('Creando nuevo paciente');
        this.editForm = this.pacienteFormService.createPacienteFormGroup();
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  /*save(): void {
    this.isSaving = true;
    const paciente = this.pacienteFormService.getPaciente(this.editForm);
    if (paciente.id !== null) {
      this.subscribeToSaveResponse(this.pacienteService.update(paciente));
    } else {
      this.subscribeToSaveResponse(this.pacienteService.create(paciente));
    }
  }*/

  /*protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaciente>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }*/

  save(): void {
    this.isSaving = true;
    const paciente = this.pacienteFormService.getPaciente(this.editForm);
    if (paciente.id !== null) {
      this.subscribeToGraphQLResponse(this.pacienteGraphQLService.update(paciente));
    } else {
      this.subscribeToGraphQLResponse(this.pacienteGraphQLService.create(paciente));
    }
  }

  protected subscribeToGraphQLResponse(result: Observable<IPaciente>): void {
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
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(paciente: IPaciente): void {
    this.paciente = paciente;
    this.pacienteFormService.resetForm(this.editForm, paciente);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, paciente.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.paciente?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
