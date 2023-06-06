
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialog} from '@angular/material';
import { Location } from '@angular/common';
import { sessionStorage } from 'src/app/localstorage.service';



@Component({
  selector: 'app-company-sales-return',
  templateUrl: './company-sales-return.component.html'
})

export class CompanySalesReturnComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;
  
  data:any ={};
  couponNumber:any={};
  savingFlag:boolean = false;
  filter:any ={};
  distributorData:any =[];
  userData: any;
  returnData:any =[];
  loader: boolean = false;
  count: any;
  total_page: any;
  sr_no: any = 0;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  active_tab = 'Sales Return';
  loginData: any;
  total_list: any
  downurl:any ='';
  
  
  constructor(public location: Location, public session: sessionStorage, public service: DatabaseService, public dialog:MatDialog, public route: ActivatedRoute, public rout: Router, public toast:ToastrManager) { 
    this.downurl = service.downloadUrl;
    this.loginData = this.session.getSession();
    this.loginData = this.loginData.value;
    this.loginData = this.loginData.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by_id=this.userData['data']['id'];
    this.data.created_by_name=this.userData['data']['name'];
    this.page_limit = service.pageLimit;
    this.getDistributor('');
  }
  
  
  ngAfterViewInit() {
    setTimeout(() => this.inputEl.nativeElement.focus());
  }
  
  ngOnInit() {
  }
  
  
  
  
  getDistributor(searcValue)
  {
    this.filter.search = searcValue;
    this.service.post_rqst({'filter':this.filter},'CouponCode/allDr').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.distributorData=result['result'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
  }
  
  
  
  findDr(id){
    let index=  this.distributorData.findIndex(row=>row.id==id)
    if(index!= -1){
      this.data.company_name= this.distributorData[index].company_name;
      this.data.dr_code= this.distributorData[index].dr_code;
    }
  }
  
  
  couponList:any =[];
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
      
      this.service.post_rqst({'coupon_code':number},'CouponCode/checkCouponCodeForSalesReturn').subscribe((result)=>
      {
        if (result['statusCode'] == 200){
          this.couponNumber.coupon_number = '';
          let temData = result['data'];
          if(this.couponList != '')
          {
            let index = this.couponList.findIndex(row => row.coupon_code == temData.coupon_code)
            if (index != -1) {
              if(this.couponList[index].coupon_code === temData.coupon_code){
                this.toast.errorToastr('Coupon code already exists');
                return
              }
            }
          }
          this.couponList.push({'id':temData.id, 'coupon_code':temData.coupon_code, 'coupon_type':temData.coupon_type, 'dispatch_date':temData.dispatch_date,   'dispatch_type':temData.dispatch_type, 'invoice_number':temData.invoice_number, 'dr_detail':temData.dr_detail, 'scan_status':temData.scan_status, 'master_packing_size':temData.master_packing_size});
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
  
  
  deleteCoupon(i)
  {
    this.couponList.splice(i,1);
    this.toast.successToastr('Coupon code delete successfully');
  }
  
  
  

  submitDetail(){
    this.data.couponData = this.couponList;
    this.savingFlag = true;
    this.service.post_rqst({'data':this.data},'CouponCode/salesReturn').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.rout.navigate(['/company-dispatch']);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    })
    
  }
  back(){
    this.location.back()
  }  
 
  
}

