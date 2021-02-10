import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDatapoint } from 'src/store/actions';
import { State, VisualContainerState } from 'src/store/state';
import { RxComponent } from '../rxcomponent/rx.component';

interface Bindings {
  visualContainer: VisualContainerState;
}

@Component({
  selector: 'app-visual-container',
  templateUrl: './visual-container.component.html',
  styleUrls: ['./visual-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualContainerComponent extends RxComponent<Bindings> {

  @Input()
  visualContainer: VisualContainerState;

  constructor(
    private store: Store<State>
  ) {
    super();
  }

  public onSelectDatapoint(): void {
    this.store.dispatch(selectDatapoint({ vc: this.visualContainer, datapoint: 'd' }))
  }
}