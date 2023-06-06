import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-coupon-detail-modal',
  templateUrl: './coupon-detail-modal.component.html',
  styleUrls: ['./coupon-detail-modal.component.scss']
})
export class CouponDetailModalComponent implements OnInit {
  couponList:any =[];
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public service:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<CouponDetailModalComponent>) { 
    if(this.data.id){
      this.getCouponList();
    }
  }
  
  ngOnInit() {
  }

  getCouponList()
  {
    this.service.post_rqst({'id':this.data.id},"CouponCode/checkCouponCodeDetailForSubCoupon").subscribe((result=>
      {

        if (result['statusCode'] == 200){
          this.couponList=result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }
      ));
      
    }
  
}
