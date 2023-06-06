import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-billing-detail',
  templateUrl: './billing-detail.component.html'
})
export class BillingDetailComponent implements OnInit {
  orderType:any ='order';
  id:any;
  data:any ={};
  skLoading:boolean = false;
  savingFlag:boolean = false;
  userData:any;
  invoice_detail:any={}
  billing_list:any=[];
  dispatchItem:any =[];
  payment_list:any=[];
  dispatch_coupon:any=[];
  dispatch_detail:any ={};
  
  constructor(public route:ActivatedRoute,public service:DatabaseService, public rout: Router,
    public dialog: MatDialog,public session:sessionStorage ,public dialogs:DialogComponent,public toast:ToastrManager) { 
      
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.data.created_by_id=this.userData['data']['id'];
      this.data.created_by_name=this.userData['data']['name'];
      
      this.route.params.subscribe( params => {
        this.id = params.id;
        this.service.currentUserID = params.id
      });
    }
    
    ngOnInit() {
      this.billDatadetail()
    }
    
    
    billDatadetail()
    {
      this.skLoading = true;
      this.service.post_rqst({'bill_id': this.id},"Dispatch/tallyInvoiceCreditBillingDetail")
      .subscribe((result=>{
        if(result['statusCode']==200){
          this.invoice_detail=result['invoice_bill'];
          this.dispatch_detail=result['dispatch_data'];
          this.billing_list=result['invoice_bill_item'];
          for (let i = 0; i < this.billing_list.length; i++) {
            this.dispatchItem.push({'item_code':this.billing_list[i]['item_code'], 'sale_qty':this.billing_list[i]['sale_qty'], 'item_name':this.billing_list[i]['item_name'], 'dispatch_qty':0, })
          }
          this.payment_list=result['payment_list'];
          this.dispatch_coupon=result['all_dispatch'];
          this.skLoading = false;
          this.service.count_list();
        }else{
          this.skLoading = false;
          this.service.count_list();
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    
  }
  