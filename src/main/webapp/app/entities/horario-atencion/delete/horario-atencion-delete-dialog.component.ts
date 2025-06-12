import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IHorarioAtencion } from '../horario-atencion.model';
import { HorarioAtencionService } from '../service/horario-atencion.service';
import { HorarioAtencionGraphQLService } from '../service/horario-atencion-graphql.service';

@Component({
  templateUrl: './horario-atencion-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class HorarioAtencionDeleteDialogComponent {
  horarioAtencion?: IHorarioAtencion;

  protected horarioAtencionGraphQLService = inject(HorarioAtencionGraphQLService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.horarioAtencionGraphQLService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
