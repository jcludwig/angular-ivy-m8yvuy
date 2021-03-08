import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { selectCurrentSectionId, selectSectionIds } from "src/store/selectors";
import { AppState, ExplorationStateId, SectionStateId } from "../../store/state";
import { ChangesFunc, RxComponent, TypedSimpleChanges } from "../rxcomponent/rx.component";

interface Bindings {
  explorationId: ExplorationStateId;
}

export interface ViewModel {
  currentSection: SectionStateId;
  sections: SectionStateId[];
}

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent extends RxComponent<Bindings> implements Bindings {

  @Input()
  public explorationId: ExplorationStateId;

  public viewModel$: Observable<ViewModel>;
  constructor(
    private readonly store: Store<AppState>
  ) {
    super('Canvas');

    this.viewModel$ = this.buildViewModel();
  }

  private buildViewModel(): Observable<ViewModel> {
    const explorationId$ = this.changes$('explorationId');

    return explorationId$.pipe(
      switchMap((explorationId) => {
        return combineLatest([
          this.store.select(selectSectionIds, { explorationId }),
          this.store.select(selectCurrentSectionId, { explorationId }),
        ])
      }),
      map(([sectionIds, currentSectionId]) => {
        return {
          sections: sectionIds,
          currentSection: currentSectionId,
        } as ViewModel;
      })
    );
  }
}