import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IEspecialidad } from '../especialidad.model';
import { EspecialidadGraphQLService } from '../service/especialidad-graphql.service';

@Component({
  selector: 'jhi-especialidad-detail',
  templateUrl: './especialidad-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class EspecialidadDetailComponent implements OnInit {
  especialidad = signal<IEspecialidad | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private especialidadGraphQLService = inject(EspecialidadGraphQLService);

  ngOnInit(): void {
    this.loadEspecialidad();
  }

  loadEspecialidad(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.especialidadGraphQLService.find(id).subscribe(
        especialidad => {
          this.especialidad.set(especialidad);
        },
        error => {
          console.error('Error cargando médico:', error);
        },
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
