import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectSections } from "../../store/selectors";
import { State } from "../../store/state";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"]
})
export class CanvasComponent implements OnInit {
  public vcs$;

  constructor(store: Store<State>) {
    this.vcs$ = store.select(selectSections);
  }

  ngOnInit() {}
}
