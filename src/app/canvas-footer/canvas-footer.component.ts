import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';
import { createBlankSection, navigateSection } from 'src/store/actions';
import { selectSections } from 'src/store/selectors';
import { AppState, SectionState, SectionStateId } from 'src/store/state';
import { ChangesFunc, RxComponent, TypedSimpleChanges } from '../rxcomponent/rx.component';

interface Bindings {
  sectionIds: SectionStateId[];
}

interface ViewModel {
   sections: SectionState[];
}

@Component({
  selector: 'app-canvas-footer',
  templateUrl: './canvas-footer.component.html',
  styleUrls: ['./canvas-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasFooterComponent extends RxComponent<Bindings> {
  @Input()
  public sectionIds: SectionStateId[];

  public viewModel$: Observable<ViewModel>;

  constructor(
    private readonly store: Store<AppState>
  ) {
    super('CanvasFooter');

    this.viewModel$ = this.buildViewModel();
  }

  public navToSection(section: SectionState) {
    this.store.dispatch(navigateSection({ section: section.id }));
  }

  public newSection(): void {
    this.store.dispatch(createBlankSection());
  }

  private buildViewModel(): Observable<ViewModel> {
    const sectionIds$ = this.changes$('sectionIds');

    return combineLatest([sectionIds$]).pipe(
      switchMap(([ids]) => this.store.select(selectSections, { sectionIds: ids })),
      map((sections) => ({
        sections
      } as ViewModel)
      )
    );
  }
}