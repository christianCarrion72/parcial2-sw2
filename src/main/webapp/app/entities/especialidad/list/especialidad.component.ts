import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IEspecialidad } from '../especialidad.model';
import { EntityArrayResponseType, EspecialidadService } from '../service/especialidad.service';
import { EspecialidadDeleteDialogComponent } from '../delete/especialidad-delete-dialog.component';
import { EspecialidadGraphQLService } from '../service/especialidad-graphql.service';

@Component({
  selector: 'jhi-especialidad',
  templateUrl: './especialidad.component.html',
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective, ItemCountComponent],
})
export class EspecialidadComponent implements OnInit {
  subscription: Subscription | null = null;
  especialidads = signal<IEspecialidad[]>([]);
  isLoading = false;

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  public readonly router = inject(Router);
  protected readonly especialidadService = inject(EspecialidadService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  private readonly especialidadGraphQLService = inject(EspecialidadGraphQLService);

  trackId = (item: IEspecialidad): number => this.especialidadService.getEspecialidadIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();
  }

  delete(especialidad: IEspecialidad): void {
    const modalRef = this.modalService.open(EspecialidadDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.especialidad = especialidad;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => {
          if (especialidad.id) {
            this.especialidadGraphQLService.delete(especialidad.id).subscribe(() => {
              this.load();
            });
          }
        }),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.especialidads.set(dataFromBody);
  }

  protected fillComponentAttributesFromResponseBody(data: IEspecialidad[] | null): IEspecialidad[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const sortParam = this.sortService.buildSortParam(this.sortState());
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: Array.isArray(sortParam) ? sortParam.join(',') : sortParam, // Convertir a string si es un array
    };
    return this.especialidadGraphQLService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const sortParam = this.sortService.buildSortParam(sortState);
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: Array.isArray(sortParam) ? sortParam.join(',') : sortParam, // Convertir a string si es un array
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
