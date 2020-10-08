import { ToBooleanPipe } from './to-boolean.pipe';

describe('ToBooleanPipe', () => {
  it('create an instance', () => {
    const pipe = new ToBooleanPipe();
    expect(pipe).toBeTruthy();
  });
});
