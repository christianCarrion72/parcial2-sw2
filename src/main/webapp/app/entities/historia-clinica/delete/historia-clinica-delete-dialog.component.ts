import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IHistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

@Component({
  templateUrl: './historia-clinica-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class HistoriaClinicaDeleteDialogComponent {
  historiaClinica?: IHistoriaClinica;

  protected historiaClinicaService = inject(HistoriaClinicaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.historiaClinicaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
