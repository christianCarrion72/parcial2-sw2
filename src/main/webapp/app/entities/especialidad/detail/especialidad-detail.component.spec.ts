import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EspecialidadDetailComponent } from './especialidad-detail.component';

describe('Especialidad Management Detail Component', () => {
  let comp: EspecialidadDetailComponent;
  let fixture: ComponentFixture<EspecialidadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialidadDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./especialidad-detail.component').then(m => m.EspecialidadDetailComponent),
              resolve: { especialidad: () => of({ id: 9300 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EspecialidadDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialidadDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load especialidad on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EspecialidadDetailComponent);

      // THEN
      expect(instance.especialidad()).toEqual(expect.objectContaining({ id: 9300 }));
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
