import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { HorarioAtencionDetailComponent } from './horario-atencion-detail.component';

describe('HorarioAtencion Management Detail Component', () => {
  let comp: HorarioAtencionDetailComponent;
  let fixture: ComponentFixture<HorarioAtencionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioAtencionDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./horario-atencion-detail.component').then(m => m.HorarioAtencionDetailComponent),
              resolve: { horarioAtencion: () => of({ id: 25186 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(HorarioAtencionDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioAtencionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load horarioAtencion on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', HorarioAtencionDetailComponent);

      // THEN
      expect(instance.horarioAtencion()).toEqual(expect.objectContaining({ id: 25186 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
