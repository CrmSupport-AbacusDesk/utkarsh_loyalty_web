import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';

@Component({
  selector: 'app-distribution-order-list',
  templateUrl: './distribution-order-list.component.html',
  animations: [slideToTop()]

})
export class DistributionOrderListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
