import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceiverComponent } from './receiver.component';

describe('ReceiverComponent', () => {
  let component: ReceiverComponent;
  let fixture: ComponentFixture<ReceiverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
