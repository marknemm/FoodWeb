import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl } from '@angular/forms';
import { FormMonitorService } from './form-monitor.service';

describe('FormMonitorService', () => {

  let service: FormMonitorService;
  let control: AbstractControl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormMonitorService);
    control = new FormControl();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should listen for disable invocations', () => {
    let disableEmitted = false;
    service.onDisable(control).subscribe(() => disableEmitted = true);
    control.disable();
    expect(disableEmitted).toEqual(true);
  });

  describe('onDisableEnable', () => {

    let disabled: boolean;

    beforeEach(() => {
      disabled = undefined;
      service.onDisableEnable(control).subscribe((state: boolean) => disabled = state);
    });

    it('should listen for disable invocations', () => {
      control.disable();
      expect(disabled).toEqual(true);
    });

    it('should listen for enable invocations', () => {
      control.enable();
      expect(disabled).toEqual(false);
    });
  });

  it('should listen for enable invocations', () => {
    let enableEmitted = false;
    service.onEnable(control).subscribe(() => enableEmitted = true);
    control.enable();
    expect(enableEmitted).toEqual(true);
  });

  it('should listen for markAllAsTouched invocations', () => {
    let touchedEmitted = false;
    service.onMarkAllAsTouched(control).subscribe(() => touchedEmitted = true);
    control.markAllAsTouched();
    expect(touchedEmitted).toEqual(true);
  });

  it('should listen for markAsDirty invocations', () => {
    let dirtyEmitted = false;
    service.onMarkAsDirty(control).subscribe(() => dirtyEmitted = true);
    control.markAsDirty();
    expect(dirtyEmitted).toEqual(true);
  });

  it('should listen for markAsPending invocations', () => {
    let pendingEmitted = false;
    service.onMarkAsPending(control).subscribe(() => pendingEmitted = true);
    control.markAsPending();
    expect(pendingEmitted).toEqual(true);
  });

  it('should listen for markAsPristine invocations', () => {
    let pristineEmitted = false;
    service.onMarkAsPristine(control).subscribe(() => pristineEmitted = true);
    control.markAsPristine();
    expect(pristineEmitted).toEqual(true);
  });

  it('should listen for markAsTouched invocations', () => {
    let touchedEmitted = false;
    service.onMarkAsTouched(control).subscribe(() => touchedEmitted = true);
    control.markAsTouched();
    expect(touchedEmitted).toEqual(true);
  });

  it('should listen for markAsUntouched invocations', () => {
    let untouchedEmitted = false;
    service.onMarkAsUntouched(control).subscribe(() => untouchedEmitted = true);
    control.markAsUntouched();
    expect(untouchedEmitted).toEqual(true);
  });

  it('should listen for patchValue invocations', () => {
    let patchedValue = '';
    service.onPatchValue(control).subscribe((event: any) => patchedValue = event.value);
    control.patchValue('new value');
    expect(patchedValue).toEqual('new value');
  });

  describe('onMutateValue', () => {

    let mutatedValue: any;

    beforeEach(() => {
      mutatedValue = '';
      service.onMutateValue(control).subscribe((event: any) => mutatedValue = event.value);
    });

    it('should listen for patchValue invocations', () => {
      control.patchValue('new value');
      expect(mutatedValue).toEqual('new value');
    });

    it('should listen for reset invocations', () => {
      control.reset('reset value');
      expect(mutatedValue).toEqual('reset value');
    });

    it('should listen for setValue invocations', () => {
      control.setValue('new value');
      expect(mutatedValue).toEqual('new value');
    });
  });

  it('should listen for reset invocations', () => {
    let resetValue = '';
    service.onReset(control).subscribe((event: any) => resetValue = event.value);
    control.reset('reset value');
    expect(resetValue).toEqual('reset value');
  });

  it('should listen for setValue invocations', () => {
    let setValue = '';
    service.onSetValue(control).subscribe((event: any) => setValue = event.value);
    control.setValue('new value');
    expect(setValue).toEqual('new value');
  });
});
