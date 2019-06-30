import { FormatDateTimePipe } from './format-date-time.pipe';
import { DateTimeService } from '../../services/date-time/date-time.service';

describe('FormatDateTimePipe', () => {
  let pipe: FormatDateTimePipe;
  let dateTimeMock: jasmine.SpyObj<DateTimeService>;

  beforeEach(() => {
    dateTimeMock = jasmine.createSpyObj<DateTimeService>(['']);
    pipe = new FormatDateTimePipe(dateTimeMock);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
