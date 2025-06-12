import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IHorarioAtencion } from '../horario-atencion.model';
import { HorarioAtencionGraphQLService } from '../service/horario-atencion-graphql.service';

@Component({
  selector: 'jhi-horario-atencion-detail',
  templateUrl: './horario-atencion-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class HorarioAtencionDetailComponent implements OnInit {
  horarioAtencion = signal<IHorarioAtencion | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private horarioAtencionGraphQLService = inject(HorarioAtencionGraphQLService);

  ngOnInit(): void {
    this.loadHorarioAtencion();
  }

  loadHorarioAtencion(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.horarioAtencionGraphQLService.find(id).subscribe(
        horarioAtencion => {
          this.horarioAtencion.set(horarioAtencion);
        },
        error => {
          console.error('Error cargando el horario de atencion:', error);
        },
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
