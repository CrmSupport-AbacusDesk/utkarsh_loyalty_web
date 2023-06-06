import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-prouct-wise-secondary-report',
  templateUrl: './prouct-wise-secondary-report.component.html',
  styleUrls: ['./prouct-wise-secondary-report.component.scss']
})
export class ProuctWiseSecondaryReportComponent implements OnInit {
  loader: boolean = false;
  secondaryProductReportList: any = [];
  search: any = {};
  constructor(private bottomSheet: MatBottomSheet,) { }

  ngOnInit() {
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'product_wise_secondary_report',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.search.date_from = data.date_from;
      this.search.date_to = data.date_to;
      this.search.userId = data.user_id;
      this.getSecondaryProductWiseReport();
    })
  }

  getSecondaryProductWiseReport() {

  }
}
