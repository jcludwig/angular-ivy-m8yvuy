import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDatapoint } from 'src/store/actions';
import { AppState, VisualContainerState } from 'src/store/state';
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

  @HostBinding('style.backgroundColor')
  public get backgroundColor(): string {
    return this.visualContainer?.background;
  }

  @Input()
  visualContainer: VisualContainerState;

  constructor(
    private store: Store<AppState>
  ) {
    super();
  }

  public onSelectDatapoint(): void {
    this.store.dispatch(selectDatapoint({ targetVC: this.visualContainer, datapoint: 'd' }))
  }
}