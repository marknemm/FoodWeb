import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DonateComponent } from './donate.component';

fdescribe('DonateComponent', () => {
  let component: DonateComponent;
  let fixture: ComponentFixture<DonateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule
      ],
      declarations: [ DonateComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On donate submit', () => {
    it('should perform donation if form is valid', () => {
      spyOn(console, 'log');
      spyOnProperty(component.donateForm, 'valid').and.returnValue(true);
      component.donate();
      expect(console.log).toHaveBeenCalledWith(component.donateForm.value);
    });

    it('should not perform donation if form is invalid', () => {
      spyOn(console, 'log');
      spyOnProperty(component.donateForm, 'valid').and.returnValue(false);
      component.donate();
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('On canShowOtherTypeInput', () => {
    it('should be able to show when donationType set to empty string (Other)', () => {
      component.donateForm.get('donationType').setValue('');
      expect(component.canShowOtherTypeInput()).toEqual(true);
    });

    it('should not be able to show when donationType is null (empty)', () => {
      component.donateForm.get('donationType').setValue(null);
      expect(component.canShowOtherTypeInput()).toEqual(false);
    });

    it('should not be able to show when donationType is a select drop-down value', () => {
      component.donationTypes.forEach((donationType: string) => {
        if (donationType !== 'Other') {
          component.donateForm.get('donationType').setValue(donationType);
          expect(component.canShowOtherTypeInput()).toEqual(false);
        }
      });
    });
  });
});
