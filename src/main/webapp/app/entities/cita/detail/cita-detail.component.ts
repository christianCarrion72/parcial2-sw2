import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ICita } from '../cita.model';
import { CitaGraphQLService } from '../service/cita-graphql.service';

@Component({
  selector: 'jhi-cita-detail',
  templateUrl: './cita-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class CitaDetailComponent implements OnInit {
  cita = signal<ICita | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private citaGraphQLService = inject(CitaGraphQLService);

  ngOnInit(): void {
    this.loadCita();
  }

  loadCita(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.citaGraphQLService.find(id).subscribe(
        cita => {
          this.cita.set(cita);
        },
        error => {
          console.error('Error cargando el horario de la cita:', error);
        },
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
