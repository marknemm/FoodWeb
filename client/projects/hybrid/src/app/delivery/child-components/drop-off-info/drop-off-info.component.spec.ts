import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropOffInfoComponent } from './drop-off-info.component';

describe('DropOffInfoComponent', () => {
  let component: DropOffInfoComponent;
  let fixture: ComponentFixture<DropOffInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropOffInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropOffInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
