import { SelectionChange } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DonationHubPledge } from '~shared';
import { Convert } from '~web/component-decorators';
import { TableDataSource, TableSelectionType } from '~web/table/interfaces/table-data-source';

@Component({
  selector: 'foodweb-donation-hub-pledge-table',
  templateUrl: './donation-hub-pledge-table.component.html',
  styleUrls: ['./donation-hub-pledge-table.component.scss']
})
export class DonationHubPledgeTableComponent implements OnChanges {

  @Convert()
  @Input() loading: boolean = false;
  @Input() pledges: DonationHubPledge[] = [];
  @Convert()
  @Input() selection: boolean = false;

  @Output() select = new EventEmitter<DonationHubPledge>();

  readonly dataSource = new TableDataSource<DonationHubPledge>([], [
    'donor',
    { name: 'foodType', visibleName: 'Sandwich Description' },
    { name: 'foodCount', visibleName: 'Sandwhich Count' },
    { name: 'actions', visibleName: '', width: '50px', minWidth: '50px' }
  ]);

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pledges) {
      this.dataSource.data = this.pledges;
    }
    if (changes.selection) {
      this.dataSource.selectionType = (this.selection ? TableSelectionType.single : undefined);
    }
  }

  onSelectionChange(change: SelectionChange<DonationHubPledge>): void {
    if (change.added?.length) {
      this.select.emit(change.added[0]);
    }
  }
}
