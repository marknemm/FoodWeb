import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DonationHubPledge } from '~shared';
import { TableDataSource, TableSelectionType } from '~web/table/interfaces/table-data-source';

@Component({
  selector: 'foodweb-donation-hub-pledge-table',
  templateUrl: './donation-hub-pledge-table.component.html',
  styleUrls: ['./donation-hub-pledge-table.component.scss']
})
export class DonationHubPledgeTableComponent implements OnChanges {

  @Input() loading = false;
  @Input() pledges: DonationHubPledge[] = [];
  @Input() selection = false;

  @Output() select = new EventEmitter<DonationHubPledge>();

  readonly dataSource = new TableDataSource<DonationHubPledge>([], [
    'donor',
    { name: 'foodType', visibleName: 'Sandwich Description' },
    { name: 'foodCount', visibleName: 'Sandwich Count' },
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

  onSelectionChange(selected: DonationHubPledge[]): void {
    if (this.selection && selected?.length) {
      this.select.emit(selected[0]);
    }
  }
}
