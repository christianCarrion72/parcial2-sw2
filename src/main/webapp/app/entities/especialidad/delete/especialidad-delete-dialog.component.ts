import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEspecialidad } from '../especialidad.model';
import { EspecialidadService } from '../service/especialidad.service';
import { EspecialidadGraphQLService } from '../service/especialidad-graphql.service';

@Component({
  templateUrl: './especialidad-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EspecialidadDeleteDialogComponent {
  especialidad?: IEspecialidad;

  //protected especialidadService = inject(EspecialidadService);
  protected especialidadGraphQLService = inject(EspecialidadGraphQLService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.especialidadGraphQLService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
