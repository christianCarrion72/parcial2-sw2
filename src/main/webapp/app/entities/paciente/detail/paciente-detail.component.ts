import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe } from 'app/shared/date';
import { IPaciente } from '../paciente.model';
import { PacienteGraphQLService } from '../service/paciente-graphql.service';

@Component({
  selector: 'jhi-paciente-detail',
  templateUrl: './paciente-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatePipe],
})
export class PacienteDetailComponent implements OnInit {
  paciente = signal<IPaciente | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private pacienteGraphQLService = inject(PacienteGraphQLService);

  ngOnInit(): void {
    this.loadPaciente();
  }

  loadPaciente(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.pacienteGraphQLService.find(id).subscribe(
        paciente => {
          this.paciente.set(paciente);
        },
        error => {
          console.error('Error cargando paciente:', error);
        },
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
