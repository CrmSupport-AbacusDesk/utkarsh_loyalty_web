import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-coupon-code-detail',
  templateUrl: './coupon-code-detail.component.html'
})
export class CouponCodeDetailComponent implements OnInit {
  
  coupon_id;
  getData:any ={};
  qrCode:any =[];
  elementType:any=''
  skLoading:boolean = false;
  today_date:Date;
  
  
  constructor( public location: Location, public session: sessionStorage,  private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public dialog1: DialogComponent) {
    this.today_date = new Date();
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.coupon_id = params.id;
      if(this.coupon_id){
        this.getCouponDetail();
      }
    });
  }
  
  back(): void {
    this.location.back()
  }
  
  getCouponDetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'offer_coupon_history_id':this.coupon_id},"CouponCode/couponSummaryDetail").subscribe((result=>
      {
        
        if (result['statusCode'] == 200){
          this.getData = result.coupon_history;
          this.qrCode = result.coupon_master_list;
          this.skLoading = false;
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
        
      }
      ));
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
      
      
    }
    