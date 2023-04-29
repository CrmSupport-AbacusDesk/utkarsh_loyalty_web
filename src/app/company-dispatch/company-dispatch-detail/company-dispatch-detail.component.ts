import { Component, OnInit, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-company-dispatch-detail',
  templateUrl: './company-dispatch-detail.component.html'
})
export class CompanyDispatchDetailComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;
  
  
  
  orderType:any ='order';
  id:any;
  data:any ={};
  couponNumber:any= {};
  savingFlag:boolean = false;
  userData:any;
  invoice_detail:any={}
  billing_list:any=[];
  dispatchItem:any =[];
  payment_list:any=[];
  dispatch_coupon:any=[];
  dispatch_detail:any ={};
  skLoading:boolean = false;
  
  constructor(public route:ActivatedRoute,public service:DatabaseService, public rout: Router,
    public dialog: MatDialog,public session:sessionStorage ,public dialogs:DialogComponent,public toast:ToastrManager) { 
      
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.data.created_by_id=this.userData['data']['id'];
      this.data.created_by_name=this.userData['data']['name'];
      
      this.route.params.subscribe( params => {
        this.id = params.id;
      });
    }
    
    ngOnInit() {
      this.billDatadetail()
    }
    
    ngAfterViewInit() {
      setTimeout(() => this.inputEl.nativeElement.focus());
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
          this.dispacthItemDetail();
          for (let i = 0; i < this.billing_list.length; i++) {
            this.dispatchItem.push({'item_code':this.billing_list[i]['item_code'], 'sale_qty':this.billing_list[i]['sale_qty'], 'item_name':this.billing_list[i]['item_name'], 'dispatch_qty':0, })
          }
          this.payment_list=result['payment_list'];
          this.dispatch_coupon=result['all_dispatch'];
          this.getdispatchDetail();
          this.skLoading = false;
          this.service.count_list();
        }else{
          this.skLoading = false;
          this.service.count_list();
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    
    
    couponList:any =[];
    temArray:any =[];
    dispatchQTY:any = 0;
    dispatchInvoice:any = 0;
    dispatch_status:any ='Pending';
    temCoupon:any =[];
    checkCoupon(number)
    {
      if(number.length == 16){
        if(number == undefined){
          this.toast.errorToastr("Enter coupon code number");
          return;
        }
        if(number == ''){
          this.toast.errorToastr("Enter coupon code number");
          return;
        }
        
        if(this.temCoupon != '')
        {
          let temData = number;
          let index = this.temCoupon.findIndex(row => row.coupon_no == temData);
          if (index != -1) {
            if(this.temCoupon[index].coupon_no === temData){
              this.clearValue();
              this.toast.errorToastr('Coupon code already exists');
              return
            }
            else{
              this.clearValue();
            }
          }
          else{
            this.clearValue();
            this.temCoupon.push({'coupon_no':number, 'status':'Pending', 'product_detail':''});
            this.dispatchItems(number);
            
          }
        }
        else{
          this.clearValue();
          this.temCoupon.push({'coupon_no':number, 'status':'Pending'});
          this.dispatchItems(number);
        }
        
      }
    }
    
    getdispatchDetail(){
      this.service.post_rqst({'invoice_id':this.id, 'invoice_no':this.invoice_detail.bill_number},'Dispatch/checkCouponCodeCheck').subscribe((result)=>
      {
        if (result['statusCode'] == 200){
          this.dispatchQTY= result['dispatch_qty'];
          this.dispatchInvoice= result['invoice_qty'];
          
          if(this.dispatchQTY == this.dispatchInvoice){
            this.dispatch_status = 'Dispatched';
          };  
          this.dispatchItem = result['dispatch']['dispatch_item'];
          console.log(this.dispatchItem);
          
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
          this.couponNumber =  {};
        }
      });
    }
    
    
    
    
    dispatchedCoupon:any ={};
    
    dispatchItems(number){
      this.service.post_rqst({'coupon_code':number, 'dispatch_status':this.dispatch_status, 'bill_dispatch_type':this.invoice_detail.bill_dispatch_type, 'dr_code':this.invoice_detail.customer_code, 'created_by_name':this.data.created_by_name, 'created_by_id':this.data.created_by_id, 'company_name':this.invoice_detail.customer_name,  'invoice_id':this.id, 'invoice_no':this.invoice_detail.bill_number},'Dispatch/checkCouponCodeCheck').subscribe((result)=>
      {
        if (result['statusCode'] == 200){
          console.log(result);
          this.dispatchedCoupon= result['coupon_code'];
          this.dispatchQTY= result['dispatch_qty'];
          this.dispatchInvoice= result['invoice_qty'];
          if(this.dispatchQTY == this.dispatchInvoice){
            this.dispatch_status = 'Dispatched';
            this.rout.navigate(['company-dispatch']);
          }
          
          this.dispatchItem = result['dispatch'];
          console.log(this.dispatchItem);
          
          
          if(this.dispatchedCoupon){
            for (let i = 0; i < this.temCoupon.length; i++) {
              if(this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon){
                if(result['statusMsg'] != 'Success' ){
                  this.toast.errorToastr(result['statusMsg']);
                }
                
                this.temCoupon[i]['status']  = result['statusMsg'];
                this.temCoupon[i]['product_detail']  = result['product_detail'];

              }
            }
          }
          
        }
        else{
          if(result['coupon_code']){
            this.dispatchedCoupon= result['coupon_code'];
            for (let i = 0; i < this.temCoupon.length; i++) {
              if(this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon){
                if(result['statusMsg'] != 'Success' ){
                  this.toast.errorToastr(result['statusMsg']);
                }
                this.temCoupon[i]['status']  =result['statusMsg'];
                this.temCoupon[i]['product_detail']  = result['product_detail'];
              }
            }
          }
          else{
            if(result['statusMsg'] == 'Coupon not exist.'){
              for (let i = 0; i < this.temCoupon.length; i++) {
                if(this.temCoupon[i]['coupon_no'] == number){
                  this.temCoupon[i]['status'] = result['statusMsg'];
                  this.temCoupon[i]['product_detail']  = result['product_detail'];
                }
              }
            }
            this.toast.errorToastr(result['statusMsg']);
          }
          this.couponNumber =  {};
        }
      }) 
    }
    
    
    clearValue(){
      this.couponNumber =  {};
    }
    
    
    
    dispacthItemDetail(){
      this.service.post_rqst({'invoice_no':this.invoice_detail.bill_number},'Dispatch/dispatchedCouponList').subscribe((result)=>
      {
        if (result['statusCode'] == 200){
          this.couponList= result['result'];
          
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }) 
    }
    
    
    
  }
  
  