import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createVisualContainer } from 'src/store/actions';
import { selectSection, selectSections, selectVisualContainers } from 'src/store/selectors';
import { AppState, SectionState, SectionStateId, VisualContainerState } from 'src/store/state';
import { RxComponent } from '../rxcomponent/rx.component';

interface Bindings {
  sectionId: SectionStateId;
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

  public section$: Observable<SectionState>;
  public visualContainers$: Observable<VisualContainerState[]>;

  constructor(
    private readonly store: Store<AppState>
  ) {
    super();

    const sectionId$ = this.changes$('sectionId');
    this.section$ = sectionId$.pipe(
      switchMap((sectionId) => store.select(selectSection, { sectionId }))
    );
    this.visualContainers$ = sectionId$.pipe(
      // NOTE: switch is important here
      switchMap((sectionId) => store.select(selectVisualContainers, { sectionId }))
    );
  }

  public newVisualContainer(): void {
    this.store.dispatch(createVisualContainer({ targetSectionId: this.sectionId }));
  }
}
