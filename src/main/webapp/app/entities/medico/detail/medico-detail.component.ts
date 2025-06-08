import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IMedico } from '../medico.model';

@Component({
  selector: 'jhi-medico-detail',
  templateUrl: './medico-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class MedicoDetailComponent {
  medico = input<IMedico | null>(null);

  previousState(): void {
    window.history.back();
  }
}
