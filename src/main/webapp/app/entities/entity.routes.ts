import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'parcial2Sw2MApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'paciente',
    data: { pageTitle: 'parcial2Sw2MApp.paciente.home.title' },
    loadChildren: () => import('./paciente/paciente.routes'),
  },
  {
    path: 'medico',
    data: { pageTitle: 'parcial2Sw2MApp.medico.home.title' },
    loadChildren: () => import('./medico/medico.routes'),
  },
  {
    path: 'especialidad',
    data: { pageTitle: 'parcial2Sw2MApp.especialidad.home.title' },
    loadChildren: () => import('./especialidad/especialidad.routes'),
  },
  {
    path: 'cita',
    data: { pageTitle: 'parcial2Sw2MApp.cita.home.title' },
    loadChildren: () => import('./cita/cita.routes'),
  },
  {
    path: 'historia-clinica',
    data: { pageTitle: 'parcial2Sw2MApp.historiaClinica.home.title' },
    loadChildren: () => import('./historia-clinica/historia-clinica.routes'),
  },
  {
    path: 'reporte',
    data: { pageTitle: 'parcial2Sw2MApp.reporte.home.title' },
    loadChildren: () => import('./reporte/reporte.routes'),
  },
  {
    path: 'horario-atencion',
    data: { pageTitle: 'parcial2Sw2MApp.horarioAtencion.home.title' },
    loadChildren: () => import('./horario-atencion/horario-atencion.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
