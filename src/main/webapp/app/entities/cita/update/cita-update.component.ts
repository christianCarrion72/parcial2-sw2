import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';
import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { IHorarioAtencion } from 'app/entities/horario-atencion/horario-atencion.model';
import { HorarioAtencionService } from 'app/entities/horario-atencion/service/horario-atencion.service';
import { EstadoCita } from 'app/entities/enumerations/estado-cita.model';
import { CitaService } from '../service/cita.service';
import { ICita } from '../cita.model';
import { CitaFormGroup, CitaFormService } from './cita-form.service';

@Component({
  selector: 'jhi-cita-update',
  templateUrl: './cita-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CitaUpdateComponent implements OnInit {
  isSaving = false;
  cita: ICita | null = null;
  estadoCitaValues = Object.keys(EstadoCita);

  pacientesSharedCollection: IPaciente[] = [];
  medicosSharedCollection: IMedico[] = [];
  horarioAtencionsSharedCollection: IHorarioAtencion[] = [];

  protected citaService = inject(CitaService);
  protected citaFormService = inject(CitaFormService);
  protected pacienteService = inject(PacienteService);
  protected medicoService = inject(MedicoService);
  protected horarioAtencionService = inject(HorarioAtencionService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CitaFormGroup = this.citaFormService.createCitaFormGroup();

  comparePaciente = (o1: IPaciente | null, o2: IPaciente | null): boolean => this.pacienteService.comparePaciente(o1, o2);

  compareMedico = (o1: IMedico | null, o2: IMedico | null): boolean => this.medicoService.compareMedico(o1, o2);

  compareHorarioAtencion = (o1: IHorarioAtencion | null, o2: IHorarioAtencion | null): boolean =>
    this.horarioAtencionService.compareHorarioAtencion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cita }) => {
      this.cita = cita;
      if (cita) {
        this.updateForm(cita);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cita = this.citaFormService.getCita(this.editForm);
    if (cita.id !== null) {
      this.subscribeToSaveResponse(this.citaService.update(cita));
    } else {
      this.subscribeToSaveResponse(this.citaService.create(cita));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICita>>): void {
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

  protected updateForm(cita: ICita): void {
    this.cita = cita;
    this.citaFormService.resetForm(this.editForm, cita);

    this.pacientesSharedCollection = this.pacienteService.addPacienteToCollectionIfMissing<IPaciente>(
      this.pacientesSharedCollection,
      cita.paciente,
    );
    this.medicosSharedCollection = this.medicoService.addMedicoToCollectionIfMissing<IMedico>(this.medicosSharedCollection, cita.medico);
    this.horarioAtencionsSharedCollection = this.horarioAtencionService.addHorarioAtencionToCollectionIfMissing<IHorarioAtencion>(
      this.horarioAtencionsSharedCollection,
      cita.horario,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pacienteService
      .query()
      .pipe(map((res: HttpResponse<IPaciente[]>) => res.body ?? []))
      .pipe(
        map((pacientes: IPaciente[]) => this.pacienteService.addPacienteToCollectionIfMissing<IPaciente>(pacientes, this.cita?.paciente)),
      )
      .subscribe((pacientes: IPaciente[]) => (this.pacientesSharedCollection = pacientes));

    this.medicoService
      .query()
      .pipe(map((res: HttpResponse<IMedico[]>) => res.body ?? []))
      .pipe(map((medicos: IMedico[]) => this.medicoService.addMedicoToCollectionIfMissing<IMedico>(medicos, this.cita?.medico)))
      .subscribe((medicos: IMedico[]) => (this.medicosSharedCollection = medicos));

    this.horarioAtencionService
      .query()
      .pipe(map((res: HttpResponse<IHorarioAtencion[]>) => res.body ?? []))
      .pipe(
        map((horarioAtencions: IHorarioAtencion[]) =>
          this.horarioAtencionService.addHorarioAtencionToCollectionIfMissing<IHorarioAtencion>(horarioAtencions, this.cita?.horario),
        ),
      )
      .subscribe((horarioAtencions: IHorarioAtencion[]) => (this.horarioAtencionsSharedCollection = horarioAtencions));
  }
}
