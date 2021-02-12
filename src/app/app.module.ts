import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { VisualContainerComponent } from './visual-container/visual-container.component';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { reducer } from 'src/store/reducers';
import { CanvasFooterComponent } from './canvas-footer/canvas-footer.component';
import { SectionContainerComponent } from './section-container/section-container.component';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [debug];

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({}, { metaReducers }),
    StoreModule.forFeature('minerva', reducer),
  ],
  declarations: [ AppComponent, CanvasComponent, VisualContainerComponent, CanvasFooterComponent, SectionContainerComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
