import { FormatTimePipe } from './format-time.pipe';
import { DateTimeService } from '../../services/date-time/date-time.service';

describe('FormatTimePipe', () => {
  let pipe: FormatTimePipe;
  let dateTimeMock: jasmine.SpyObj<DateTimeService>;

  beforeEach(() => {
    dateTimeMock = jasmine.createSpyObj<DateTimeService>(['']);
    pipe = new FormatTimePipe(dateTimeMock);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
