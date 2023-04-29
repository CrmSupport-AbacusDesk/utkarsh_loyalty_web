import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage } from 'src/app/localstorage.service';
import { CouponDetailModalComponent } from '../coupon-detail-modal/coupon-detail-modal.component';
import { MatDialog} from '@angular/material';
import { Location } from '@angular/common';



@Component({
  selector: 'app-replacement',
  templateUrl: './replacement.component.html',
})


export class ReplacementComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;
  couponNumber:any={};
  userData: any;
  qrCode:any =[];
  getData:any =[];
  
  
  
  constructor(public location: Location,public service: DatabaseService, public dialog:MatDialog, public route: ActivatedRoute, public session:sessionStorage, public rout: Router, public toast:ToastrManager) { 
    this.userData = JSON.parse(localStorage.getItem('st_user'));
  }
  
  ngOnInit() {
  }
  
  
  ngAfterViewInit() {
    setTimeout(() => this.inputEl.nativeElement.focus());
  }
  
  
  
  holdValue:any =[]

  checkCoupon(number)
  {
    if(number.length == 10){
      if(number == undefined){
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      if(number == ''){
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      
      this.service.post_rqst({'coupon_code':number},'CouponCode/mrpReplacement').subscribe((result)=>
      {
        if (result['statusCode'] == 200){
          this.couponNumber.coupon_number = '';
          this.getData = result['coupon_history'];
          this.holdValue = result['coupon_master_list'];
          let temData  
          let temArray  
          temData = this.getData;
          temArray = this.holdValue;

          if(this.qrCode != '')
          {
            let index = this.qrCode.findIndex(row => row.coupon_code == number);
            console.log(index);
            if (index != -1) {
              this.toast.errorToastr('Coupon code already exists');
              return
            }
          }

          this.qrCode.push({'coupon_code':temArray[0]['coupon_code'], 'coupon_type':temArray[0]['coupon_type'], 'product_mrp':temArray[0]['product_mrp'], 'product_qty':temArray[0]['product_qty'], 'itembox':temArray[0]['itembox'], 'product_detail':temData.product_detail, 'sku_code':temData.sku_code, 'remarks':temData.remarks, 'hardner_code':temData.hardner_code, 'hardner_qty':temData.hardner_qty, 'date_created':temData.date_created, 'batch_no':temData.batch_no, 'product_source':temData.product_source});
        }
        else{
          this.couponNumber.coupon_number = '';
          this.toast.errorToastr(result['statusMsg']);
        }
      }
      , error => {
      })
    }
  }
  


  
  
  printData(): void
  {
    let printContents, popupWin;
    printContents = document.getElementById('print_card').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    
    popupWin.document.write(`
    <html>
    <head>
    <title>Print tab</title>
    <style>
    @media print {
      #qr_code_container  {
        page-break-inside: always;
        margin-bottom: 0px
      }
      @page { 
        margin: 0.07in 0.1in 0.00in;  
      }
      
      .bar-code-img, .barcode{
        
        width:105px !important;
        min-width:105px !important;
        height: 110px !important;
      }
      .barcode svg{
        width: 100%;
        height: 100%;
      }
      
      body
      {
        font-family: 'arial';
      }
      </style>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
      </html>`
      );
      
      popupWin.document.close();
    }
    
    
    
    
    back(){
      this.location.back()
    }  
    
  }