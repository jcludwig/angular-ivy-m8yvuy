import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable } from 'rxjs';
import { createBlankExploration } from 'src/store/actions';
import { selectCurrentExploration, selectCurrentSection } from 'src/store/selectors';
import { SectionState, AppState, VisualContainerState, ExplorationState } from 'src/store/state';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent  {
  public currentExploration$: Observable<ExplorationState>;

  constructor(
    private readonly store: Store<AppState>
  ) {
    this.currentExploration$ = store.select(selectCurrentExploration);
  }

  public onCreateExploration(): void {
    // NOTE: how might I get the ID back synchronously?
    this.store.dispatch(createBlankExploration());
  }
}