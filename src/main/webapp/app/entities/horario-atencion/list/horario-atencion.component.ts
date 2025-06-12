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
import { IHorarioAtencion } from '../horario-atencion.model';
import { EntityArrayResponseType, HorarioAtencionService } from '../service/horario-atencion.service';
import { HorarioAtencionDeleteDialogComponent } from '../delete/horario-atencion-delete-dialog.component';
import { HorarioAtencionGraphQLService } from '../service/horario-atencion-graphql.service';

@Component({
  selector: 'jhi-horario-atencion',
  templateUrl: './horario-atencion.component.html',
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective, ItemCountComponent],
})
export class HorarioAtencionComponent implements OnInit {
  subscription: Subscription | null = null;
  horarioAtencions = signal<IHorarioAtencion[]>([]);
  isLoading = false;

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  public readonly router = inject(Router);
  protected readonly horarioAtencionService = inject(HorarioAtencionService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected readonly horarioAtencionGraphQLService = inject(HorarioAtencionGraphQLService);

  trackId = (item: IHorarioAtencion): number => this.horarioAtencionService.getHorarioAtencionIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();
  }

  delete(horarioAtencion: IHorarioAtencion): void {
    const modalRef = this.modalService.open(HorarioAtencionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.horarioAtencion = horarioAtencion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => {
          if (horarioAtencion.id) {
            this.horarioAtencionGraphQLService.delete(horarioAtencion.id).subscribe(() => {
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
    this.horarioAtencions.set(dataFromBody);
  }

  protected fillComponentAttributesFromResponseBody(data: IHorarioAtencion[] | null): IHorarioAtencion[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.horarioAtencionGraphQLService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
