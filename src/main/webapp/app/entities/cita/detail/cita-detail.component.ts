import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ICita } from '../cita.model';

@Component({
  selector: 'jhi-cita-detail',
  templateUrl: './cita-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class CitaDetailComponent {
  cita = input<ICita | null>(null);

  previousState(): void {
    window.history.back();
  }
}
