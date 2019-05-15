import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../services/page-title/page-title.service';

@Component({
  selector: 'food-web-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  constructor(
    public pageTitleService: PageTitleService
  ) {}

  ngOnInit() {}

}
