import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import {DialogComponent} from 'src/app/dialog.component';



@Component({
  selector: 'app-coupon-code-list',
  templateUrl: './coupon-code-list.component.html'
})
export class CouponCodeListComponent implements OnInit {
  fabBtnValue:any ='add';
  active_tab:any ='item_box'
  filter:any = {};  
  couponData:any =[];
  scanData:any=[];
  pageCount:any;
  total_page:any; 
  page_limit: any =500;
  pagenumber:any =1;
  start: any = 0;
  sr_no: number;
  loader: boolean=false;
  noResult:boolean = false;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  today_date:any;
  tabCount:any ={}
  downurl:any;
  data:any ={};
  
  
  
  
  
  constructor(public service:DatabaseService, public toast:ToastrManager,public session:sessionStorage, public alertDialog: DialogComponent) {
    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.downurl = service.downloadUrl;
    // this.page_limit = service.pageLimit;
    this.couponCodeList();
    
  }
  
  ngOnInit() {
  }
  
  pervious(type){
    this.start = this.start - this.page_limit;
    if(type == 'scan_item'){
      this.scanCouponList();
    }
    else{
      this.couponCodeList();
    }
  }
  
  nextPage(type){
    this.start = this.start + this.page_limit;
    if(type == 'scan_item'){
      this.scanCouponList();
    }
    else{
      this.couponCodeList();
    }
  }
  
  couponCodeList(){
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    
    if (this.filter.date_created){
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date){
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    
    this.filter.active_tab = this.active_tab;
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},'/CouponCode/couponCodeList').subscribe((resp)=>
    {
      if (resp['statusCode'] == 200){
        this.couponData = resp['scanned_coupon_code_list']
        this.pageCount=resp['count'];
        
        this.loader =false;
        
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        
        setTimeout(() => {
          if(this.couponData.length == 0){
            this.noResult = true;
          } 
        }, 500);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
      
    })
  }
  
  
  
  scanCouponList(){
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    
    if (this.filter.date_created){
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date){
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    if (this.filter.scanned_on){
      this.filter.scanned_on = moment(this.filter.scanned_on).format('YYYY-MM-DD');
    }
    
    this.filter.active_tab = this.active_tab;
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},'/CouponCode/scannedCouponCodeList').subscribe((resp)=>
    {
      if (resp['statusCode'] == 200){
        this.scanData = resp['scanned_coupon_code_list']
        this.pageCount=resp['count'];
        
        this.loader =false;
        
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        
        setTimeout(() => {
          if(this.scanData.length == 0){
            this.noResult = true;
          } 
        }, 500);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
      
    })
  }
  
  
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  
  refresh(type){
    this.filter={};
    if(this.start<0){
      this.start=0;
    }
    
    if(type == 'scan_item'){
      this.scanCouponList();
    }
    else{
      this.couponCodeList();
    }
  }
  
  
  
  reopenCoupon(couponCode) {
    let alertText
    alertText = "You want to reopen this" + ' ' + couponCode + ' ' + 'code' 
    this.alertDialog.confirm(alertText).then((result)=>{
      if(result){
        this.data.created_by_name=this.assign_login_data2.name;
        this.data.created_by_id=this.assign_login_data2.id;
        this.data.coupon_code=couponCode;
        this.service.post_rqst({'data':this.data}, "couponCode/CouponReopen").subscribe((response => {
          if(response['statusCode']=="200"){
            this.toast.successToastr(response['statusMsg']);
            this.scanCouponList();
          }
          else{
            this.toast.errorToastr(response['statusMsg']);
          }
        }));
      }
    });
  }
  
  
  exportAsXLSX(status)
  {
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},'/Excel/coupon_code_all_list').subscribe((result=>{
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.couponCodeList();
      }else{
      }
    }));
  }
  
}
