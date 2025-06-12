import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPaciente } from '../paciente.model';
import { PacienteService } from '../service/paciente.service';
import { PacienteGraphQLService } from '../service/paciente-graphql.service';

@Component({
  templateUrl: './paciente-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PacienteDeleteDialogComponent {
  paciente?: IPaciente;

  //protected pacienteService = inject(PacienteService);
  protected pacienteGraphQLService = inject(PacienteGraphQLService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pacienteGraphQLService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
