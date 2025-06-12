import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IReporte } from '../reporte.model';
import { ReporteGraphQLService } from '../service/reporte-graphql.service';

@Component({
  selector: 'jhi-reporte-detail',
  templateUrl: './reporte-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class ReporteDetailComponent implements OnInit {
  reporte = signal<IReporte | null>(null);
  private activatedRoute = inject(ActivatedRoute);
  protected readonly reporteGraphQLService = inject(ReporteGraphQLService);

  ngOnInit(): void {
    this.loadReporte();
  }

  loadReporte(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.reporteGraphQLService.find(id).subscribe(
        reporte => {
          this.reporte.set(reporte);
        },
        error => {
          console.error('Error cargando reporte:', error);
        },
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
