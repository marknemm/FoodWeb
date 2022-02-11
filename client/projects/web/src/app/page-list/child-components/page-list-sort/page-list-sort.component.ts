import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SortByOpt } from '~web/page-list/interfaces/sort-by-opt';
export { SortByOpt };

@Component({
  selector: 'foodweb-page-list-sort',
  templateUrl: './page-list-sort.component.html',
  styleUrls: ['./page-list-sort.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageListSortComponent<T> {

  @Input() formGroup: FormGroup;
  @Input() sortByFormControlName = 'sortBy';
  @Input() sortByOpts: SortByOpt<T>[] = [];
  @Input() sortOrderFormControlName = 'sortOrder';

  @HostBinding() class = 'foodweb-page-list-sort';

}
