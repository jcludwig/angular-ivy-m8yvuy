import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { CanvasComponent } from './canvas/canvas.component';
import { VisualContainerComponent } from './visual-container/visual-container.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, CanvasComponent, VisualContainerComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
