import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IHorarioAtencion } from '../horario-atencion.model';

@Component({
  selector: 'jhi-horario-atencion-detail',
  templateUrl: './horario-atencion-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class HorarioAtencionDetailComponent {
  horarioAtencion = input<IHorarioAtencion | null>(null);

  previousState(): void {
    window.history.back();
  }
}
