import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
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
import { IHistoriaClinica, NewHistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaFormGroup, HistoriaClinicaFormService } from './historia-clinica-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrediccionModalComponent } from './prediccion-modal.component';

@Component({
  selector: 'jhi-historia-clinica-update',
  templateUrl: './historia-clinica-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class HistoriaClinicaUpdateComponent implements OnInit {
  isSaving = false;
  historiaClinica: IHistoriaClinica | null = null;

  pacientesSharedCollection: IPaciente[] = [];

  protected http = inject(HttpClient);
  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected modalService = inject(NgbModal);
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

  /*save(): void {
    this.isSaving = true;
    const historiaClinica = this.historiaClinicaFormService.getHistoriaClinica(this.editForm);
    if (historiaClinica.id !== null) {
      this.subscribeToSaveResponse(this.historiaClinicaService.update(historiaClinica));
    } else {
      this.subscribeToSaveResponse(this.historiaClinicaService.create(historiaClinica));
    }
  }*/
  save(): void {
    this.isSaving = true;
    const historiaClinica = this.historiaClinicaFormService.getHistoriaClinica(this.editForm);

    // Llamar al endpoint GraphQL para obtener el hash
    this.getBlockchainHash(historiaClinica).subscribe({
      next: hash => {
        // Asignar el hash obtenido
        historiaClinica.hashBlockchain = hash;

        // Continuar con el guardado
        if (historiaClinica.id !== null) {
          this.subscribeToSaveResponse(this.historiaClinicaService.update(historiaClinica));
        } else {
          this.subscribeToSaveResponse(this.historiaClinicaService.create(historiaClinica));
        }
      },
      error: error => {
        console.error('Error al obtener hash de blockchain:', error);
        this.onSaveError();
      },
    });
  }

  protected getBlockchainHash(historiaClinica: IHistoriaClinica | NewHistoriaClinica): Observable<string> {
    const endpoint = 'https://smartcontractmicroservice-production.up.railway.app/graphql';

    // Formatear la fecha para la consulta GraphQL (YYYY-MM-DD)
    const fecha = historiaClinica.fecha ? historiaClinica.fecha.format('YYYY-MM-DD') : '';

    // Construir la consulta GraphQL
    const graphqlQuery = {
      query: `
        mutation {
          registrarHistoria(
            fecha: "${fecha}"
            sintomas: "${historiaClinica.sintomas || ''}"
            diagnostico: "${historiaClinica.diagnostico || ''}"
            tratamiento: "${historiaClinica.tratamiento || ''}"
          )
        }
      `,
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Realizar la llamada al endpoint GraphQL
    return this.http.post(endpoint, graphqlQuery, { headers }).pipe(
      map((response: any) => {
        // Extraer el hash del resultado
        return response.data.registrarHistoria;
      }),
    );
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

  consultarPrediccion(): void {
    const sintomas = this.editForm.get('sintomas')?.value || '';
    const paciente = this.editForm.get('paciente')?.value;

    if (!sintomas) {
      this.eventManager.broadcast(
        new EventWithContent<AlertError>('parcial2Sw2MApp.error', new AlertError('Debe ingresar síntomas para obtener una predicción')),
      );
      return;
    }

    if (!paciente) {
      this.eventManager.broadcast(
        new EventWithContent<AlertError>(
          'parcial2Sw2MApp.error',
          new AlertError('Debe seleccionar un paciente para obtener una predicción'),
        ),
      );
      return;
    }

    const nroHistoriaClinica = paciente.nroHistoriaClinica || '';

    // Construir la consulta GraphQL según la imagen proporcionada
    const graphqlQuery = {
      query: `
        query {
          predecir(
            edad: 25,
            sexo: "M",
            sintomas: "${sintomas}"
          ) {
            enfermedad
            recomendacion
          }
        }
      `,
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Realizar la llamada al endpoint GraphQL
    this.http.post('/prediccion-api/graphql', graphqlQuery, { headers }).subscribe({
      next: (response: any) => {
        if (response.data && response.data.predecir) {
          this.mostrarPrediccion(response.data.predecir);
        } else {
          this.eventManager.broadcast(
            new EventWithContent<AlertError>('parcial2Sw2MApp.error', new AlertError('No se pudo obtener una predicción')),
          );
        }
      },
      error: error => {
        console.error('Error al obtener predicción:', error);
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('parcial2Sw2MApp.error', new AlertError('Error al consultar el servicio de predicción')),
        );
      },
    });
  }

  mostrarPrediccion(prediccion: any): void {
    const modalRef = this.modalService.open(PrediccionModalComponent);
    modalRef.componentInstance.prediccion = prediccion;
  }
}
