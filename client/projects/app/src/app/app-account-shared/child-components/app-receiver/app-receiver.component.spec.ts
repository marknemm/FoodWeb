import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReceiverComponent } from './app-receiver.component';

describe('AppReceiverComponent', () => {
  let component: AppReceiverComponent;
  let fixture: ComponentFixture<AppReceiverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReceiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
