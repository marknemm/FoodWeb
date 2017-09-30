import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodListingDialogComponent } from './food-listing-dialog.component';

describe('FoodDetailsComponent', () => {
  let component: FoodListingDialogComponent;
  let fixture: ComponentFixture<FoodListingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodListingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodListingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
