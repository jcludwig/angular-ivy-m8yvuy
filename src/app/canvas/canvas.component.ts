import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { selectCurrentSectionId, selectSectionIds } from "src/store/selectors";
import { AppState, ExplorationStateId, SectionStateId } from "../../store/state";
import { RxComponent } from "../rxcomponent/rx.component";

interface Bindings {
  explorationId: ExplorationStateId;
}

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent extends RxComponent<Bindings> {

  @Input()
  public explorationId: ExplorationStateId;

  public currentSection$: Observable<SectionStateId>;
  public sections$: Observable<SectionStateId[]>;

  constructor(store: Store<AppState>) {
    super();

    this.sections$ = this.changes$('explorationId').pipe(
      switchMap((explorationId) => store.select(selectSectionIds, { explorationId }))
    );

    this.currentSection$ = this.changes$('explorationId').pipe(
      switchMap((explorationId) => store.select(selectCurrentSectionId, { explorationId }))
    );
  }
}
