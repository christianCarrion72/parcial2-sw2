import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IMedico } from '../medico.model';
import { MedicoGraphQLService } from '../service/medico-graphql.service';

@Component({
  selector: 'jhi-medico-detail',
  templateUrl: './medico-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class MedicoDetailComponent implements OnInit {
  medico = signal<IMedico | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private medicoGraphQLService = inject(MedicoGraphQLService);

  ngOnInit(): void {
    this.loadMedico();
  }

  loadMedico(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.medicoGraphQLService.find(id).subscribe(
        medico => {
          this.medico.set(medico);
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
