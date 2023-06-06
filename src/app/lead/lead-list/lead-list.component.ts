import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { MatDialog } from '@angular/material';
import { ChangeEnquiryStatusComponent } from '../change-enquiry-status/change-enquiry-status.component';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  animations: [slideToTop()]
  
  
})
export class LeadListComponent implements OnInit {
  active_tab:any = 'Pending';
  fabBtnValue:any ='add';
  lead_List:any=[];
  datanotfound:boolean=true;
  type_id:any = 1;
  loader:any=false;
  data:any=[];
  value:any={};
  data_not_found=false;
  search_val:any={}
  type:any;
  today_date:any;
  count_list:any={};
  login_data: any = {};
  login_data5: any = {};
  add: any = {};
  filter:any ={}
  enquiryList:any=[]
  sr_no:any=0;
  pageCount:any;
  total_page:any;
  pagenumber:any=1;
  start:any=0;
  count:any;
  page_limit:any;
  influencerType: any;
  
  
  constructor(public serve:DatabaseService, public toast:ToastrManager,public dialog:DialogComponent, public alrt:MatDialog,public router: Router, public route: ActivatedRoute,public session: sessionStorage ) {
    this.page_limit = this.serve.pageLimit
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;
    this.route.params.subscribe( params => {
      this.today_date = new Date().toISOString().slice(0, 10);
      this.type_id = params.id;
      this.type = params.type;
    });
  }
  
  ngOnInit() {
   this.filter = this.serve.getData()
   if(this.filter.status){
    this.active_tab = this.filter.status
   }
   this.leadList(this.active_tab);
    this.influencer_type();

  }

  pervious(){
    this.start = this.start - this.page_limit;
    this.leadList(this.active_tab);
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.leadList(this.active_tab);
  }
  
  date_format(): void
  {
    this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD'); 
    this.leadList(this.active_tab);
  }
  
  influencer_type(){
    this.serve.post_rqst({},"Enquiry/leadNetworkModule").subscribe(result=>{

      if(result['statusCode'] == 200){
        this.influencerType = result['modules'];
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
      }
    })
    
  }
  
  leadList(status)
  {
    this.loader=true;
    if(this.search_val.modified_date){
      this.search_val.modified_date=moment(this.search_val.modified_date).format('YYYY-MM-DD');
      
    }
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start < 0){
      this.start = 0;
    } 
    
    this.filter.status = status;
    this.serve.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},"Enquiry/enquiryList")
    .subscribe((result=>{
      if(result['statusCode'] == 200){
        this.count=result['count'];
        this.count=result['count'];

        this.lead_List= result['enquiry_list'];
        if(this.lead_List.length==0){
          this.datanotfound=true;
        }else{
          this.datanotfound=false;
        }
        this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        if(status == 'Pending'){
          this.pageCount =  this.count.Pending;
          this.total_page = Math.ceil(parseInt(this.pageCount)/this.page_limit);
        }
        else if(status == 'Qualified'){
          this.pageCount =  this.count.Qualified;
          this.total_page = Math.ceil(parseInt(this.pageCount)/this.page_limit);
        }
        else if(status == 'Disqualified'){
          this.pageCount =  this.count.Disqualified;
          this.total_page = Math.ceil(parseInt(this.pageCount)/this.page_limit);
        }
        else if(status == 'Win'){
          this.pageCount =  this.count.Win;
          this.total_page = Math.ceil(parseInt(this.pageCount)/this.page_limit);
        }
        else{
          this.pageCount =  this.count.Lost;
          this.total_page = Math.ceil(parseInt(this.pageCount)/this.page_limit);
        }
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }      
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.serve.count_list();
        setTimeout (() => {
          this.loader=false;
        }, 700);
        if(this.lead_List.length == 0){
          this.data_not_found=true;
        }else{
          this.data_not_found=false;
        }
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        this.loader = false;
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.loader = false;
      }
      
      
    }))
    
  }
  
  
  upload_excel(type)
  {
    const dialogRef = this.alrt.open(UploadFileModalComponent,{
      width: '500px',
      panelClass:'cs-modal',
      data:{
        'from':'enquiryList',
        'modal_type':type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.leadList(this.active_tab);
      }
    });
  }
  
  
  refresh()
  {
    this.filter={};
    this.serve.currentUserID = ''
    this.serve.setData(this.filter)
    this.leadList(this.active_tab);
  }
  
  
  change_date_filter(type): void
  {
    if(type == 'date_from'){
      this.search_val.date_from=moment(this.search_val.date_from).format('YYYY-MM-DD');
      this.leadList(this.active_tab);
    }
    
    else if(type == 'date_to'){
      this.search_val.date_to=moment(this.search_val.date_to).format('YYYY-MM-DD');
      this.leadList(this.active_tab);
    }
    else{
    }
    
    
  }
  
  
  related_tabs(tab) {
    this.active_tab = tab;
  }
  
  userStatus(index, id,name) {
    this.dialog.confirm('You Want To Change Status').then((result)=>{
      if(result){
        if (this.lead_List[index].checkin_active == "1") {
          this.lead_List[index].checkin_active = "0";
        }
        else {
          this.lead_List[index].checkin_active = "1";
        }
        let value = { "checkin_active": this.lead_List[index].checkin_active }
        this.serve.post_rqst({ 'dr_id': id, 'data': value ,'uid':this.login_data5.id,'uname':name}, "Lead/checkin_active")
        .subscribe(resp => {
          this.leadList(this.active_tab);
        })
      }
      
    })
  }
  
  
  
  changeStatus(user_id, name, enqid) {
    const dialogRef = this.alrt.open(ChangeEnquiryStatusComponent, {
      width: '600px',
      panelClass:'cs-modal',
      data:{
        'id':user_id,
        'user_name':name,
        'enquiry_id':enqid
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.leadList(this.active_tab);
      } 
    });
  }
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  
}
