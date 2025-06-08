import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';
import { HistoriaClinicaService } from '../service/historia-clinica.service';
import { IHistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaFormGroup, HistoriaClinicaFormService } from './historia-clinica-form.service';

@Component({
  selector: 'jhi-historia-clinica-update',
  templateUrl: './historia-clinica-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class HistoriaClinicaUpdateComponent implements OnInit {
  isSaving = false;
  historiaClinica: IHistoriaClinica | null = null;

  pacientesSharedCollection: IPaciente[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected historiaClinicaService = inject(HistoriaClinicaService);
  protected historiaClinicaFormService = inject(HistoriaClinicaFormService);
  protected pacienteService = inject(PacienteService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: HistoriaClinicaFormGroup = this.historiaClinicaFormService.createHistoriaClinicaFormGroup();

  comparePaciente = (o1: IPaciente | null, o2: IPaciente | null): boolean => this.pacienteService.comparePaciente(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historiaClinica }) => {
      this.historiaClinica = historiaClinica;
      if (historiaClinica) {
        this.updateForm(historiaClinica);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('parcial2Sw2MApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const historiaClinica = this.historiaClinicaFormService.getHistoriaClinica(this.editForm);
    if (historiaClinica.id !== null) {
      this.subscribeToSaveResponse(this.historiaClinicaService.update(historiaClinica));
    } else {
      this.subscribeToSaveResponse(this.historiaClinicaService.create(historiaClinica));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistoriaClinica>>): void {
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

  protected updateForm(historiaClinica: IHistoriaClinica): void {
    this.historiaClinica = historiaClinica;
    this.historiaClinicaFormService.resetForm(this.editForm, historiaClinica);

    this.pacientesSharedCollection = this.pacienteService.addPacienteToCollectionIfMissing<IPaciente>(
      this.pacientesSharedCollection,
      historiaClinica.paciente,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pacienteService
      .query()
      .pipe(map((res: HttpResponse<IPaciente[]>) => res.body ?? []))
      .pipe(
        map((pacientes: IPaciente[]) =>
          this.pacienteService.addPacienteToCollectionIfMissing<IPaciente>(pacientes, this.historiaClinica?.paciente),
        ),
      )
      .subscribe((pacientes: IPaciente[]) => (this.pacientesSharedCollection = pacientes));
  }
}
