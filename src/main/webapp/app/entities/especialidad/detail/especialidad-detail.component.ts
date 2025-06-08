import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IEspecialidad } from '../especialidad.model';

@Component({
  selector: 'jhi-especialidad-detail',
  templateUrl: './especialidad-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class EspecialidadDetailComponent {
  especialidad = input<IEspecialidad | null>(null);

  previousState(): void {
    window.history.back();
  }
}
