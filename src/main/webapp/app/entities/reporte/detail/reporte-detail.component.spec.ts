import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReporteDetailComponent } from './reporte-detail.component';

describe('Reporte Management Detail Component', () => {
  let comp: ReporteDetailComponent;
  let fixture: ComponentFixture<ReporteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./reporte-detail.component').then(m => m.ReporteDetailComponent),
              resolve: { reporte: () => of({ id: 30486 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ReporteDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load reporte on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ReporteDetailComponent);

      // THEN
      expect(instance.reporte()).toEqual(expect.objectContaining({ id: 30486 }));
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
