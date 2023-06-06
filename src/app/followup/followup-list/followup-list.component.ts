import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html',
  animations: [slideToTop()]
  
})
export class FollowupListComponent implements OnInit {
  
  followup_list:any=[];
  search:any={};
  active_tab = 'pending';
  loader:any;
  datanotfound=false;
  skelton:any={}
  excel_data: any=[];
  count_list:any=[];
  assign_login_data: any = [];
  assign_login_data2: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  sr_no:any=0;
  total_page:any;
  pageCount:any;
  page_limit: any;
  fabBtnValue:any='excel';
  pagenumber:any =1;
  start: any = 0;
  tabCount:any =0;
  downurl:any ='';
  constructor(public toast: ToastrManager, public serve:DatabaseService,public alert: DialogComponent,public dialog:MatDialog,public session: sessionStorage)
  {
    this.page_limit = serve.pageLimit;
    this.downurl = serve.downloadUrl;
    
    this.skelton = new Array(10);
    
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    
    this.assign_login_data = this.assign_login_data.assignModule;
    
    
  }
  
  ngOnInit()
  {
    this.search = this.serve.getData()
   if(this.search.status){
    this.active_tab = this.search.status
   }
    this.followUpList();
  }
 
  
  clearFilter(){
    this.search = {};
    this.serve.setData(this.search)
    this.serve.currentUserID = ''
    this.followUpList();
  }
  
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.followUpList('');
  }
  
  nextPage(){
    
    this.start = this.start + this.page_limit;
    this.followUpList('');
  }
  
  
  followUpList(action:any='')
  {
    
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    
    if(action == "refresh")
    {
      this.search = {};
    }
    if(this.search.followup_date)
    {
      this.search.followup_date=moment(this.search.followup_date).format('YYYY-MM-DD');
    }
    if(this.search.date_created)
    {
      this.search.date_created=moment(this.search.date_created).format('YYYY-MM-DD');
    }
    if(this.search.date_from)
    {
      this.search.date_from=moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if(this.search.date_to)
    {
      this.search.date_to=moment(this.search.date_to).format('YYYY-MM-DD');
    }

    if (this.start < 0) {
      this.start = 0;
    }
    
    this.loader=true;
    this.serve.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start,'pagelimit': this.page_limit, 'search': this.search, 'active_tab': this.active_tab, 'user_type': this.assign_login_data2.type},"Followup/followupList").subscribe(result=>
      {
     if(result['statusCode']==200){
      this.followup_list=result['followup_list'];
      this.tabCount=result['count'];
      this.pageCount=result['count'];
      if(this.active_tab == 'pending'){
        this.pageCount =  this.pageCount.pending;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        
      }
      else if(this.active_tab == 'upcoming'){
        this.pageCount =  this.pageCount.upcoming;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
      }
      else{
        this.pageCount =  this.pageCount.complete;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
      }
      
      
      
      if(this.pagenumber > this.total_page){
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      else{
        this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      }
      this.sr_no = this.pagenumber - 1;
      this.sr_no = this.sr_no * this.page_limit;
      if(this.count_list.length ==0)
      {
        this.datanotfound=true;
      }
      else
      {
        this.datanotfound=false;
      }
      
      setTimeout (() => {
        this.loader=false;
        
      }, 100);
     }else{
      this.loader=false;
      this.toast.errorToastr(result['statusMsg']);
     }
      },err=>{
        this.loader=false;
        this.toast.errorToastr('Something went wrong');
      })
    }
    
    
    delete_followup(followup_id){
      this.alert.delete('Followup !').then((result) => {
        if (result) {
          
          this.serve.post_rqst({'followup_id':followup_id}, "Followup/deleteFollowup").subscribe((result) => {

            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.followUpList()
              this.serve.count_list();

            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          }, err=> {
            this.toast.errorToastr('Something went wrong');
          })
        }
      });
      
      
    }
    
    
    exportAsXLSX(status)
    {
      this.search.status = status;
      this.serve.post_rqst(
        { 'user_id': this.assign_login_data2.id, 'start': this.start,'pagelimit': this.page_limit, 'search': this.search, 'active_tab': this.active_tab, 'user_type': this.assign_login_data2.type},"Excel/followup_list"
       ).subscribe((result=>{
      
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.followUpList('');
      }else{
        
      }
      
    }));
    
  }
  
  
}
