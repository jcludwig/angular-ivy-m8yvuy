import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasFooterComponent } from './canvas-footer.component';

describe('CanvasFooterComponent', () => {
  let component: CanvasFooterComponent;
  let fixture: ComponentFixture<CanvasFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
