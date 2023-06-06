import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';




@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html'
})
export class BottomSheetComponent implements OnInit {
  search:any ={};
  today_date: any = new Date();
  lastPageData:any ={}
  
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, public service: DatabaseService,  private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>, public toast: ToastrManager ) {
    this.lastPageData = data;
    if(this.lastPageData.filterPage == 'Expense'){
      this.getSalesUser('');
    }
    if(this.lastPageData.filterPage == 'product_wise_secondary_report'){
      this.getSalesUser('');
    }
  }
  
  ngOnInit() {
  }


  public date(date) {
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
  }
  
  
  
  salesUser: any = [];
  getSalesUser(searchValue) {
    this.service.post_rqst({ 'search': searchValue }, "Expense/salesUserList").subscribe((response => {
      if(response['statusCode'] == 200){
        this.salesUser = response['all_sales_user'];
        if(this.lastPageData.filterPage == 'product_wise_secondary_report'){
          this.salesUser.unshift({'id':0,'name':'All', 'role_name':''})
        }
      }else{
        this.toast.errorToastr(response['statusMsg']);
      }
    }));
  }

  getValue(){
    this.bottomSheetRef.dismiss(this.search);
  }


  
}
