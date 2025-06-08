import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReporte } from '../reporte.model';
import { ReporteService } from '../service/reporte.service';

@Component({
  templateUrl: './reporte-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReporteDeleteDialogComponent {
  reporte?: IReporte;

  protected reporteService = inject(ReporteService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reporteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
