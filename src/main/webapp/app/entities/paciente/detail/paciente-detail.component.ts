import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe } from 'app/shared/date';
import { IPaciente } from '../paciente.model';

@Component({
  selector: 'jhi-paciente-detail',
  templateUrl: './paciente-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatePipe],
})
export class PacienteDetailComponent {
  paciente = input<IPaciente | null>(null);

  previousState(): void {
    window.history.back();
  }
}
