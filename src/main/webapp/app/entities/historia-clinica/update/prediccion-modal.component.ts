import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-prediccion-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Sugerencia de Diagnóstico</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p><strong>Enfermedad sugerida:</strong> {{ prediccion.enfermedad }}</p>
      <p><strong>Recomendación:</strong> {{ prediccion.recomendacion }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close('OK')">OK</button>
    </div>
  `,
  standalone: true,
  imports: [SharedModule],
})
export class PrediccionModalComponent {
  @Input() prediccion: any;

  constructor(public activeModal: NgbActiveModal) {}
}
