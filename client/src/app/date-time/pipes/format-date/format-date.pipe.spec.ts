import { FormatDatePipe } from './format-date.pipe';
import { DateTimeService } from '../../services/date-time/date-time.service';

describe('FormatDatePipe', () => {
  let pipe: FormatDatePipe;
  let dateTimeMock: jasmine.SpyObj<DateTimeService>;

  beforeEach(() => {
    dateTimeMock = jasmine.createSpyObj<DateTimeService>(['']);
    pipe = new FormatDatePipe(dateTimeMock);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
