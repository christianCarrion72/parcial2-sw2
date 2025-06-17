import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { IEspecialidad } from 'app/entities/especialidad/especialidad.model';
import { EspecialidadService } from 'app/entities/especialidad/service/especialidad.service';
import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { IHorarioAtencion } from 'app/entities/horario-atencion/horario-atencion.model';
import { HorarioAtencionService } from 'app/entities/horario-atencion/service/horario-atencion.service';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';
import { EstadoCita } from 'app/entities/enumerations/estado-cita.model';
import { CitaGraphQLService } from '../service/cita-graphql.service';
import { NewCita } from '../cita.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-cita-paciente-create',
  templateUrl: './cita-paciente-create.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CitaPacienteCreateComponent implements OnInit {
  isSaving = false;
  constructor(
    // ... existing code ...
    private http: HttpClient,
  ) {}
  especialidades: IEspecialidad[] = [];
  medicosDisponibles: IMedico[] = [];
  horariosDisponibles: IHorarioAtencion[] = [];
  pacienteActual: IPaciente | null = null;

  protected fb = inject(FormBuilder);
  protected especialidadService = inject(EspecialidadService);
  protected medicoService = inject(MedicoService);
  protected horarioAtencionService = inject(HorarioAtencionService);
  protected pacienteService = inject(PacienteService);
  protected citaGraphQLService = inject(CitaGraphQLService);
  protected accountService = inject(AccountService);
  protected router = inject(Router);

  editForm = this.fb.group({
    especialidad: [null as IEspecialidad | null, [Validators.required]],
    medico: [null as IMedico | null, [Validators.required]],
    horario: [null as IHorarioAtencion | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadEspecialidades();
    this.loadPacienteActual();

    // Escuchar cambios en especialidad para filtrar médicos
    this.editForm.get('especialidad')?.valueChanges.subscribe(especialidad => {
      if (especialidad?.id) {
        this.loadMedicosPorEspecialidad(especialidad.id);
        this.editForm.get('medico')?.setValue(null);
        this.editForm.get('horario')?.setValue(null);
        this.horariosDisponibles = [];
      }
    });

    // Escuchar cambios en médico para filtrar horarios
    this.editForm.get('medico')?.valueChanges.subscribe(medico => {
      if (medico?.id) {
        this.loadHorariosPorMedico(medico.id);
        this.editForm.get('horario')?.setValue(null);
      }
    });
  }

  loadEspecialidades(): void {
    this.especialidadService.query().subscribe({
      next: (res: HttpResponse<IEspecialidad[]>) => {
        this.especialidades = res.body ?? [];
      },
      error: () => {
        console.error('Error al cargar especialidades');
      },
    });
  }

  loadPacienteActual(): void {
    this.accountService.identity().subscribe(account => {
      if (account?.login) {
        // Cargar todos los pacientes y filtrar por user.login
        this.pacienteService.query().subscribe({
          next: (res: HttpResponse<IPaciente[]>) => {
            const pacientes = res.body ?? [];
            // Filtrar el paciente que corresponde al usuario actual
            const pacienteEncontrado = pacientes.find(p => p.user?.login === account.login);
            if (pacienteEncontrado) {
              this.pacienteActual = pacienteEncontrado;
              console.log('Paciente cargado:', this.pacienteActual);
              console.log('Historia clínica:', this.pacienteActual.nroHistoriaClinica);
            } else {
              console.error('No se encontró paciente para el usuario:', account.login);
            }
          },
          error: () => {
            console.error('Error al cargar datos del paciente');
          },
        });
      }
    });
  }

  loadMedicosPorEspecialidad(especialidadId: number): void {
    // Cargar todos los médicos y filtrar por especialidad en el frontend
    this.medicoService.query().subscribe({
      next: (res: HttpResponse<IMedico[]>) => {
        const todosMedicos = res.body ?? [];
        // Filtrar médicos que tengan la especialidad seleccionada
        this.medicosDisponibles = todosMedicos.filter(medico => medico.especialidades?.some(esp => esp.id === especialidadId));
      },
      error: () => {
        console.error('Error al cargar médicos por especialidad');
      },
    });
  }

  loadHorariosPorMedico(medicoId: number): void {
    // Cargar todos los horarios y filtrar por médico en el frontend
    this.horarioAtencionService.query().subscribe({
      next: (res: HttpResponse<IHorarioAtencion[]>) => {
        const todosHorarios = res.body ?? [];
        // Filtrar horarios que pertenezcan al médico seleccionado
        this.horariosDisponibles = todosHorarios.filter(horario => horario.medico?.id === medicoId);
      },
      error: () => {
        console.error('Error al cargar horarios por médico');
      },
    });
  }

  save(): void {
    if (this.editForm.valid && this.pacienteActual) {
      this.isSaving = true;

      const nuevaCita: NewCita = {
        id: null,
        fechaHora: dayjs(), // Usar dayjs en lugar de string
        estado: EstadoCita.PROGRAMADA,
        confirmada: false,
        paciente: this.pacienteActual,
        medico: this.editForm.get('medico')?.value,
        horario: this.editForm.get('horario')?.value,
      };

      this.subscribeToSaveResponse(this.citaGraphQLService.create(nuevaCita));
    }
  }

  protected subscribeToSaveResponse(result: Observable<any>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.router.navigate(['/cita']);
  }

  protected onSaveError(): void {
    // Error handling
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  previousState(): void {
    window.history.back();
  }

  compareEspecialidad = (o1: IEspecialidad | null, o2: IEspecialidad | null): boolean =>
    this.especialidadService.compareEspecialidad(o1, o2);

  compareMedico = (o1: IMedico | null, o2: IMedico | null): boolean => this.medicoService.compareMedico(o1, o2);

  compareHorarioAtencion = (o1: IHorarioAtencion | null, o2: IHorarioAtencion | null): boolean =>
    this.horarioAtencionService.compareHorarioAtencion(o1, o2);
}
