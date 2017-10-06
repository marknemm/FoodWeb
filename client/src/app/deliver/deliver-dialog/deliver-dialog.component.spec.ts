import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverDialogComponent } from './deliver-dialog.component';

describe('DeliverDialogComponent', () => {
  let component: DeliverDialogComponent;
  let fixture: ComponentFixture<DeliverDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
