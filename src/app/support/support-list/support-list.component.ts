import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { SupportStatusComponent } from '../support-status/support-status.component';

import { sessionStorage } from 'src/app/localstorage.service';

import { ImageModuleComponent } from 'src/app/image-module/image-module.component';



@Component({
  selector: 'app-support-list',
  templateUrl: './support-list.component.html'
})

export class SupportListComponent implements OnInit {
  
  fabBtnValue:any ='add';
  active_tab:any ='Pending'
  filter:any = {};
  count:any = {};
  tabCount:any;
  loader:boolean = false;
  pageCount:any;
  total_page:any; 
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  supportList_data:any =[];
  sr_no: number;
  userData: any;
  userId: any;
  userName: any;
  noResult:boolean = false;
  downurl:any ='';
  url:any='';
  
  assign_login_data: any = [];
  assign_login_data2: any = [];
  
  constructor(public service:DatabaseService,public toast:ToastrManager, public dialog:MatDialog, public alert: DialogComponent,public session: sessionStorage) { 
    this.page_limit = service.pageLimit;
    this.url = this.service.uploadUrl + 'support/';
    this.downurl = service.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.supportList();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
  }
  
  ngOnInit() {
  }
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.supportList();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.supportList();
  }
  
  supportList(){
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
    }
    if(this.start<0){
      this.start=0;
    }
    
    if (this.filter.date_created){
      
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit,'status':this.active_tab},'Support/getSupportList').subscribe((resp)=>
    {
      if (resp['statusCode'] == 200) {
        
        this.supportList_data = resp['data'];
        this.tabCount=resp['tabCount'];
        this.pageCount=resp['count'];
        this.loader = false;
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          if(this.pageCount!=0){
            
            this.start = this.pageCount - this.page_limit;
          }
          else{
            this.start=0
          }
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
          if(this.supportList_data.length == 0){
            this.noResult = true;
          } else{
            this.noResult = false;
          }
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }
  
  
  refresh(){
    this.filter={}
    this.supportList();
    
  }
  
  
  openDialog(id): void {
    const dialogRef = this.dialog.open(SupportStatusComponent, {
      width: '400px',
      panelClass:'padding0',
      data: {
        'id': id,
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.supportList()
      }
    });
    
  }
  
  
  exportAsXLSX()
  {
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit,'status':this.active_tab},'Support/getSupportList').subscribe((result)=>{
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.supportList();
      }else{
      }
    });
  }
  
  goToImage(image)
  {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
      panelClass:'Image-modal',
      data:{
        'image':image,
        'type':'base64'
      }});
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    
  }
  