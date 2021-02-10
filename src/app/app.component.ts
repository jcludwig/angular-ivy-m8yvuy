import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable } from 'rxjs';
import { take, tap, timeInterval, withLatestFrom } from 'rxjs/operators';
import { addSection, addVisualContainer } from 'src/store/actions';
import { selectCurrentSection } from 'src/store/selectors';
import { SectionState, State, VisualContainerState } from 'src/store/state';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent  {
  public currentSection$: Observable<SectionState>;

  constructor(
    store: Store<State>
  ) {
    this.currentSection$ = store.select(selectCurrentSection);

    const firstSection: SectionState = {
      id: 'first',
      title: 'Section 1',
      visualContainers: [],
    };

    // add first section
    store.dispatch(
      addSection({ section: firstSection })
    );

    let i = 0;
    interval(2000)
      .pipe(
        take(5),
        withLatestFrom(this.currentSection$),
        tap(([_, currentSection]) => {
          store.dispatch(
            addVisualContainer({
              section: currentSection,
              vc: buildVC(i++),
            })
          );
        })
      )
      .subscribe();
  }
}

function buildVC(index: number): VisualContainerState {
  return {
    name: index+"",
    title: `Visual Container ${index}`,
    config: {
      query: 'q',
    }
  };
}
