import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReporte } from '../reporte.model';
import { ReporteService } from '../service/reporte.service';
import { ReporteFormGroup, ReporteFormService } from './reporte-form.service';
import { ReporteGraphQLService } from '../service/reporte-graphql.service';

@Component({
  selector: 'jhi-reporte-update',
  templateUrl: './reporte-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReporteUpdateComponent implements OnInit {
  isSaving = false;
  reporte: IReporte | null = null;

  protected reporteService = inject(ReporteService);
  protected reporteFormService = inject(ReporteFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected reporteGraphQLService = inject(ReporteGraphQLService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReporteFormGroup = this.reporteFormService.createReporteFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reporte }) => {
      this.reporte = reporte;
      if (reporte) {
        console.log('Editando reporte:', reporte);
        this.updateForm(reporte);
      } else {
        console.log('Creando nuevo reporte:');
        this.editForm = this.reporteFormService.createReporteFormGroup();
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  /*save(): void {
    this.isSaving = true;
    const reporte = this.reporteFormService.getReporte(this.editForm);
    if (reporte.id !== null) {
      this.subscribeToSaveResponse(this.reporteService.update(reporte));
    } else {
      this.subscribeToSaveResponse(this.reporteService.create(reporte));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReporte>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }*/

  save(): void {
    this.isSaving = true;
    const reporte = this.reporteFormService.getReporte(this.editForm);
    if (reporte.id !== null) {
      this.subscribeToGraphQLResponse(this.reporteGraphQLService.update(reporte));
    } else {
      this.subscribeToGraphQLResponse(this.reporteGraphQLService.create(reporte));
    }
  }

  protected subscribeToGraphQLResponse(result: Observable<IReporte>): void {
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

  protected updateForm(reporte: IReporte): void {
    this.reporte = reporte;
    this.reporteFormService.resetForm(this.editForm, reporte);
  }
}
