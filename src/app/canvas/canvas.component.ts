import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SectionState, State, VisualContainerState } from "../../store/state";
import { RxComponent } from "../rxcomponent/rx.component";

interface Bindings {
  section: SectionState;
}

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent extends RxComponent<Bindings> {
  @Input()
  section: SectionState;

  public visualContainers$: Observable<VisualContainerState[]>;

  constructor(store: Store<State>) {
    super();

    const section$ = this.changes$("section");
    this.visualContainers$ = section$.pipe(
      map((section) => section.visualContainers),
    );
  }
}
