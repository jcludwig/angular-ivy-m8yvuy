import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { createVisualContainer } from 'src/store/actions';
import { selectSection, selectSections, selectVisualContainers } from 'src/store/selectors';
import { AppState, SectionState, SectionStateId, VisualContainerState } from 'src/store/state';
import { ChangesFunc, RxComponent } from '../rxcomponent/rx.component';

interface Bindings {
  sectionId: SectionStateId;
}

interface ViewModel {
  section: SectionState;
  visualContainers: VisualContainerState[];
}

@Component({
  selector: 'app-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionContainerComponent extends RxComponent<Bindings> {
  @Input()
  sectionId: SectionStateId;

  public viewModel$: Observable<ViewModel>;

  constructor(
    private readonly store: Store<AppState>
  ) {
    super('SectionContainer');

    this.viewModel$ = this.buildViewModel();
  }

  public newVisualContainer(): void {
    this.store.dispatch(createVisualContainer({ targetSectionId: this.sectionId }));
  }

  private buildViewModel(): Observable<ViewModel> {
    const sectionId$ = this.changes$('sectionId');

    return combineLatest([sectionId$]).pipe(
      switchMap(([sectionId]) => {
        return combineLatest([
          this.store.select(selectSection, { sectionId }),
          this.store.select(selectVisualContainers, { sectionId }),
        ]);
      }),
      map(([section, visualContainers]) => ({
        section,
        visualContainers,
      } as ViewModel))
    );
  }
}
