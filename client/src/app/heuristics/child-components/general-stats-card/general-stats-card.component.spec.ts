import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStatsCardComponent } from './general-stats-card.component';

describe('GeneralStatsCardComponent', () => {
  let component: GeneralStatsCardComponent;
  let fixture: ComponentFixture<GeneralStatsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralStatsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
