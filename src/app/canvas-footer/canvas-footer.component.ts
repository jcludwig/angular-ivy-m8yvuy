import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createBlankSection, navigateSection } from 'src/store/actions';
import { selectSections } from 'src/store/selectors';
import { AppState, SectionState, SectionStateId } from 'src/store/state';
import { RxComponent } from '../rxcomponent/rx.component';

interface Bindings {
  sectionIds: SectionStateId[];
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

  public sections$: Observable<SectionState[]>;

  constructor(
    private readonly store: Store<AppState>
  ) {
    super();

    this.sections$ = this.changes$('sectionIds').pipe(
      switchMap((ids) => this.store.select(selectSections, { sectionIds: ids }))
    );
  }

  public navToSection(section: SectionState) {
    this.store.dispatch(navigateSection({ section: section.id }));
  }

  public newSection(): void {
    this.store.dispatch(createBlankSection());
  }
}
