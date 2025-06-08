import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IReporte } from '../reporte.model';

@Component({
  selector: 'jhi-reporte-detail',
  templateUrl: './reporte-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class ReporteDetailComponent {
  reporte = input<IReporte | null>(null);

  previousState(): void {
    window.history.back();
  }
}
