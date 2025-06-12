import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICita } from '../cita.model';
import { CitaService } from '../service/cita.service';
import { CitaGraphQLService } from '../service/cita-graphql.service';

@Component({
  templateUrl: './cita-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CitaDeleteDialogComponent {
  cita?: ICita;

  protected citaGraphQLService = inject(CitaGraphQLService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.citaGraphQLService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
