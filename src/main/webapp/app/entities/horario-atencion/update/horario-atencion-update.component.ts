import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, timeout } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { DiaSemana } from 'app/entities/enumerations/dia-semana.model';
import { HorarioAtencionService } from '../service/horario-atencion.service';
import { IHorarioAtencion } from '../horario-atencion.model';
import { HorarioAtencionFormGroup, HorarioAtencionFormService } from './horario-atencion-form.service';
import { HorarioAtencionGraphQLService } from '../service/horario-atencion-graphql.service';

@Component({
  selector: 'jhi-horario-atencion-update',
  templateUrl: './horario-atencion-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class HorarioAtencionUpdateComponent implements OnInit {
  isSaving = false;
  horarioAtencion: IHorarioAtencion | null = null;
  diaSemanaValues = Object.keys(DiaSemana);

  medicosSharedCollection: IMedico[] = [];

  protected horarioAtencionService = inject(HorarioAtencionService);
  protected horarioAtencionGraphQLService = inject(HorarioAtencionGraphQLService);
  protected horarioAtencionFormService = inject(HorarioAtencionFormService);
  protected medicoService = inject(MedicoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: HorarioAtencionFormGroup = this.horarioAtencionFormService.createHorarioAtencionFormGroup();

  compareMedico = (o1: IMedico | null, o2: IMedico | null): boolean => this.medicoService.compareMedico(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ horarioAtencion }) => {
      this.horarioAtencion = horarioAtencion;
      if (horarioAtencion) {
        console.log('Editando horario de atencion:', horarioAtencion);
        this.updateForm(horarioAtencion);
      } else {
        console.log('Creando nuevo horario de atencion:');
        this.editForm = this.horarioAtencionFormService.createHorarioAtencionFormGroup();
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  /*save(): void {
    this.isSaving = true;
    const horarioAtencion = this.horarioAtencionFormService.getHorarioAtencion(this.editForm);
    if (horarioAtencion.id !== null) {
      this.subscribeToSaveResponse(this.horarioAtencionService.update(horarioAtencion));
    } else {
      this.subscribeToSaveResponse(this.horarioAtencionService.create(horarioAtencion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHorarioAtencion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }*/
  save(): void {
    this.isSaving = true;
    const horarioAtencion = this.horarioAtencionFormService.getHorarioAtencion(this.editForm);
    if (horarioAtencion.id !== null) {
      this.subscribeToGraphQLResponse(this.horarioAtencionGraphQLService.update(horarioAtencion));
    } else {
      this.subscribeToGraphQLResponse(this.horarioAtencionGraphQLService.create(horarioAtencion));
    }
  }

  protected subscribeToGraphQLResponse(result: Observable<IHorarioAtencion>): void {
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

  protected updateForm(horarioAtencion: IHorarioAtencion): void {
    this.horarioAtencion = horarioAtencion;
    this.horarioAtencionFormService.resetForm(this.editForm, horarioAtencion);

    this.medicosSharedCollection = this.medicoService.addMedicoToCollectionIfMissing<IMedico>(
      this.medicosSharedCollection,
      horarioAtencion.medico,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.medicoService
      .query()
      .pipe(map((res: HttpResponse<IMedico[]>) => res.body ?? []))
      .pipe(map((medicos: IMedico[]) => this.medicoService.addMedicoToCollectionIfMissing<IMedico>(medicos, this.horarioAtencion?.medico)))
      .subscribe((medicos: IMedico[]) => (this.medicosSharedCollection = medicos));
  }
}
