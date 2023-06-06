import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {
  active_tab:any ='Pending';
  leave_list:any=[];
  loader:any;
  search:any={};
  skelton:any={}
  datanotfound = false;
  data:any={};
  today_date:Date;
  user_id:any=[];
  assign_login_data2:any={}
  activePage_count:any;
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  count:any=[];
  sr_no:any=0;
  total_page:any;
  pageCount:any=0;
  page_limit: any=0;
  pagenumber:any =1;
  start: any = 0;
  status_count:any;
  downurl:any ='';
  
  constructor(public toast: ToastrManager, public serve:DatabaseService,public dialog:DialogComponent,public navparams: ActivatedRoute, public dialogs: MatDialog,public session: sessionStorage)
  {
    this.page_limit = serve.pageLimit
    this.downurl = serve.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.skelton = new Array(10);
    this.today_date = new Date();
    
  }

  
  pervious(status){
    this.start = this.start - this.page_limit;
    this.leaveList(status);
  }
  
  nextPage(status){
    
    this.start = this.start + this.page_limit;
    this.leaveList(status);
  }
  
  
  ngOnInit()
  {
    this.leaveList(this.active_tab);
    this.search = {};
  }

  public onDate(event): void{
    console.log(event.value);
    if(this.search.date_created){
      this.search.date_created=moment(event.value).format('YYYY-MM-DD');
      this.leaveList(this.active_tab);
    }
    if(this.search.leave_start_date){
      this.search.leave_start_date=moment(event.value).format('YYYY-MM-DD');
      this.leaveList(this.active_tab);
    }
    if(this.search.leave_end_date){
      this.search.leave_end_date=moment(event.value).format('YYYY-MM-DD');
      this.leaveList(this.active_tab);
    }
  }

  openDialog(leave_id): void {
    const dialogRef = this.dialogs.open(ChangeStatusComponent, {
      width: '500px',
      panelClass:'cs-modal',
      data:{
        id : leave_id,
        reason: ''
      }
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.leaveList(this.active_tab);
      }
    });
  }
  
  leaveList(status)
  {
    if(this.search.date_created)
    {
      this.search.date_created = moment(this.search.date_created).format('YYYY-MM-DD');
      if(this.search.date_from)
      {
        this.search.date_from= moment(this.search.date_from).format('YYYY-MM-DD');
      }
      if(this.search.date_to)
      {
        this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
        
      }
    }
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    this.search.status = status;
    this.loader=true;
    this.serve.post_rqst({ 'user_id': this.assign_login_data2.id,'start': this.start,'pagelimit': this.page_limit, filter: this.search,'user_type': this.assign_login_data2.type
},"Leaves/leaveList").subscribe(result=>
    {
      this.leave_list = result['result']['data'];
      this.status_count = result['result']['status_count'];
      if(result['statusCode']==200){
        setTimeout(() => {
          this.loader = false;
        }, 100);
        this.activePage_count = result['result']['status_count'][status];
        this.pageCount=result['result']['count'];
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.activePage_count - this.page_limit;
        }
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.activePage_count/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        
        if(this.leave_list.length == 0)
        {
          this.datanotfound = true;
          
        }
        else
        {
          this.datanotfound = false;
        }
      }else{
        this.loader = false;
        this.datanotfound = true;
        console.log(this.leave_list.length)
        this.toast.errorToastr(result['statusMsg']);
    }
    }, err=>{
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    });
  }
  excel_data:any=[];
  refresh(){
    this.search ={};
    this.data={};
    this.pagenumber=0;
    this.start=0;
    this.leaveList(this.active_tab);
  }
  
  
  
  exportAsXLSX(status)
  {
    this.search.status = status;
    this.serve.post_rqst({ 'user_id': this.assign_login_data2.id,'start': this.start,'pagelimit': this.page_limit, filter: this.search,'user_type': this.assign_login_data2.type
  },"Excel/leave_list").subscribe((result=>{
    
    if(result['msg'] == true){
      window.open(this.downurl + result['filename'])
      this.leaveList(this.active_tab);
    }else{
      
    }
    
  }));
  
}

}
