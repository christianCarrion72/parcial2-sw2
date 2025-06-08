import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { IEspecialidad } from '../especialidad.model';
import { EspecialidadService } from '../service/especialidad.service';
import { EspecialidadFormGroup, EspecialidadFormService } from './especialidad-form.service';

@Component({
  selector: 'jhi-especialidad-update',
  templateUrl: './especialidad-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EspecialidadUpdateComponent implements OnInit {
  isSaving = false;
  especialidad: IEspecialidad | null = null;

  medicosSharedCollection: IMedico[] = [];

  protected especialidadService = inject(EspecialidadService);
  protected especialidadFormService = inject(EspecialidadFormService);
  protected medicoService = inject(MedicoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EspecialidadFormGroup = this.especialidadFormService.createEspecialidadFormGroup();

  compareMedico = (o1: IMedico | null, o2: IMedico | null): boolean => this.medicoService.compareMedico(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ especialidad }) => {
      this.especialidad = especialidad;
      if (especialidad) {
        this.updateForm(especialidad);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const especialidad = this.especialidadFormService.getEspecialidad(this.editForm);
    if (especialidad.id !== null) {
      this.subscribeToSaveResponse(this.especialidadService.update(especialidad));
    } else {
      this.subscribeToSaveResponse(this.especialidadService.create(especialidad));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEspecialidad>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
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

  protected updateForm(especialidad: IEspecialidad): void {
    this.especialidad = especialidad;
    this.especialidadFormService.resetForm(this.editForm, especialidad);

    this.medicosSharedCollection = this.medicoService.addMedicoToCollectionIfMissing<IMedico>(
      this.medicosSharedCollection,
      ...(especialidad.medicos ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.medicoService
      .query()
      .pipe(map((res: HttpResponse<IMedico[]>) => res.body ?? []))
      .pipe(
        map((medicos: IMedico[]) =>
          this.medicoService.addMedicoToCollectionIfMissing<IMedico>(medicos, ...(this.especialidad?.medicos ?? [])),
        ),
      )
      .subscribe((medicos: IMedico[]) => (this.medicosSharedCollection = medicos));
  }
}
