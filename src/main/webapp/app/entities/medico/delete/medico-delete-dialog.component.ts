import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMedico } from '../medico.model';
import { MedicoGraphQLService } from '../service/medico-graphql.service';

@Component({
  templateUrl: './medico-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MedicoDeleteDialogComponent {
  medico?: IMedico;

  protected medicoGraphQLService = inject(MedicoGraphQLService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medicoGraphQLService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
