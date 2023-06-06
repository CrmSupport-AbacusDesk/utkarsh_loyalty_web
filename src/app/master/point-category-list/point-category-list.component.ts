import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
// import { MyserviceService } from 'src/app/myservice.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-point-category-list',
  templateUrl: './point-category-list.component.html'
})
export class PointCategoryListComponent implements OnInit {
  fabBtnValue:any ='add';
  active_tab:any ='Master Box';
  no_found:boolean = false;
  pointCategories_data:any=[];
  loader:boolean = false;
  filter:any = {};
  sr_no:any=0;
  pageCount:any;
  total_page:any; 
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  assign_login_data:any={};
  logined_user_data:any={};
  downurl :any;
  today_date: Date;

  
  constructor(public service:DatabaseService, public toast:ToastrManager, public alert: DialogComponent, public dialog:DialogComponent, private router: Router,public session: sessionStorage) 
  { this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.pointCategory_data(this.active_tab);
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.today_date = new Date();

  }
  
  ngOnInit() {
  }
  
  
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.pointCategory_data(this.active_tab);
    
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.pointCategory_data(this.active_tab);
    
  }
  
  date_format(): void
  {
    this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD'); 
    this.pointCategory_data(this.active_tab);
    
  }
  
  pointCategory_data(tab)
  {
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    
    this.filter.point_type = tab;
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},'Master/pointCategoryMasterListForPointCategory').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.pointCategories_data=resp['point_category_list'];
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
          this.loader = false;
        }, 700);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    }
    , error => {
    })
  }
  
  
  
  
  
  getpointCategoryExcel(user_type) {
    
    this.service.post_rqst({'filter':this.filter}, "Excel/point_category_master_list_for_export").subscribe((result) => {
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.pointCategory_data(this.active_tab);
      }else{
      }
    });
  }
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  refresh(){
    this.filter = {};
    this.pointCategory_data(this.active_tab);
  }
  edit(id){
    this.router.navigate(['/point-add/' +id]);
  } 
  
  delete(id){
    this.alert.delete('Point Category !').then((result) => {
      if (result) {
        this.service.post_rqst({'id':id}, "Master/deletePointCategoryMaster").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.pointCategory_data(this.active_tab);
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
         
        })
      }
    });
    
    
  }
}
