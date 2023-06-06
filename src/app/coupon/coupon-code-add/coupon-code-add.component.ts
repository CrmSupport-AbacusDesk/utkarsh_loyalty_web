import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-coupon-code-add',
  templateUrl: './coupon-code-add.component.html'
})
export class CouponCodeAddComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  product_data:any = []
  coupon_summary_list:any = []
  data:any ={};
  filter:any ={};
  savingFlag: boolean=false; 
  page_limit:any;
  start: any = 0;
  pagenumber:any =1;
  total_page:any; 
  pageCount:any;
  sr_no:any =0;
  loader:boolean = false;
  noResult:boolean = false;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  uploadurl:any;
  today_date: Date;
  
  
  constructor(public location: Location, public service:DatabaseService, public route: ActivatedRoute, public rout: Router, public toast:ToastrManager,public dialog:DialogComponent,public session:sessionStorage) { 
    this.page_limit = service.pageLimit;
    this.uploadurl = service.uploadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.today_date = new Date();

  }
  
  ngOnInit() {
    this.generated_coupon_listing();
  }
  
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.generated_coupon_listing();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.generated_coupon_listing();
  }
  
  
  
  refresh(){
    this.filter = {};   
    this.generated_coupon_listing();
  }
  
  getProduct(searcValue)
  {
    this.filter.coupon_type = this.data.coupon_type;
    this.filter.product_name = searcValue;
    this.service.post_rqst({'filter':this.filter},'CouponCode/productList').subscribe((resp)=>
    {
      if (resp['statusCode'] == 200){
        this.product_data=resp['data'];
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  
  
  
  date_format(): void
  {
    this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD'); 
    this.generated_coupon_listing();
  }
  
  
  generated_coupon_listing(){
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    this.service.post_rqst({'search':this.filter, 'start': this.start, 'pagelimit': this.page_limit},'CouponCode/couponSummaryList').subscribe((resp)=>
    {   
      
      if (resp['statusCode'] == 200){
        
        this.coupon_summary_list=resp['coupon_summary_list'];
        this.loader = false;
        this.pageCount = resp['count'];
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
          if(this.coupon_summary_list.length == 0){
            this.noResult = true;
          } 
        }, 500);
        
        
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
  
  
  findProductId(code){
    let index=  this.product_data.findIndex(row=>row.product_code==code)
    if(index!= -1){
      this.data.product_id= this.product_data[index].product_id;
      this.data.product_name= this.product_data[index].product_name;
      this.data.sku_code= this.product_data[index].sku_code;
      this.data.mrp= this.product_data[index].mrp;
      this.data.qty= this.product_data[index].qty;
      this.data.uom= this.product_data[index].uom;
    }
  }
  
  
  
  
  
  submitDetail(){
    if(parseInt(this.data.total_coupon) < 1){
      this.toast.errorToastr('Minimum coupon value 1');
      return
    }
    else if (this.data.total_coupon>10000){
      this.toast.errorToastr('Total Coupon Should be less than 10,000');
      this.savingFlag = false;
      return
    }
    
    else{
      this.data.created_by_name=this.userName;
      this.data.created_by_id=this.userId;
      this.savingFlag = true;
      this.service.post_rqst({'data':this.data},'CouponCode/genrateCoupon').subscribe((result)=>
      {
        if (result['statusCode'] == 200){
          this.toast.successToastr(result['statusMsg']);
          this.rout.navigate(['coupon-list/coupon-add/coupon-code-detail/' + result['offer_coupon_history_id']]);
          this.savingFlag = false;
          // this.generated_coupon_listing();
          this.data = {};
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;
        }
      })
    }
    
  }
  deletecoupon(id){
    this.dialog.delete('Coupon!').then((result) => {
      if (result) {
        
        this.service.post_rqst({'coupon_summary_id':id},'CouponCode/deleteCouponSummary').subscribe((result)=>
        {   
          if (result['statusCode'] == 200){
            this.toast.successToastr(result['statusMsg']);
            this.generated_coupon_listing()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });
    
    
  }
  
  
  
  downloadCoupon(id){
    this.service.post_rqst({'id':id}, "Excel/coupon_code_all_list").subscribe((result) => {
      document.location.replace(this.uploadurl+'Download_excel/couponcode.csv');
      if(result['msg']==true){
        this.toast.successToastr('Success');
      }
      else{
        this.toast.errorToastr('Failed');
      }
    })
  }
  
  
  back(){
    this.location.back()
  }  
}
