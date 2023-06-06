import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { Location } from '@angular/common';
import { LeadAddFollowupModelComponent } from '../lead-add-followup-model/lead-add-followup-model.component';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ChangeEnquiryStatusComponent } from '../change-enquiry-status/change-enquiry-status.component';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';





@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styles: ['agm-map { height: 300px; }'],
  animations: [slideToTop()]
})
export class LeadDetailComponent implements OnInit {
  exp_loader:any=false;
  tabType:any ='Profile';
  fabBtnValue:any = 'status'
  lead_id: any;
  active: any = {};
  data: any = {};
  type:any;
  lead_detail: any = [];
  filter: any = {};
  loader: boolean = false;
  tabActiveType: any = {};
  data_not_found:boolean = false;
  followup_list: any = [];
  userData: any;
  userId: any;
  userName: any;
  login_data:any={};
  login_data5: any = {};
  add: any = {};
  lead_logs:any=[]
  dr_id:any;
  
  sr_no:any=0;
  total_page:any;
  pageCount:any;
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  minDate:any;
  
  
  constructor(
    public route: ActivatedRoute,
    public serve: DatabaseService,
    public router: Router,
    public dialog: MatDialog,
    public session: sessionStorage,
    public alert: DialogComponent,
    public toast:ToastrManager,
    private _location: Location,) {
      this.page_limit = serve.pageLimit;
      this.login_data = this.session.getSession();
      this.login_data = this.login_data.value;
      this.login_data5 = this.login_data.data;
      this.login_data = this.login_data.assignModule;
      this.minDate = new Date();
      const index = this.login_data.findIndex(row => row.module_name == 'Lead Distributors');
     
      this.route.params.subscribe(params => {
        this.lead_id = params.id;
        this.serve.currentUserID = params.id
      });
    
      this.leadDetail();
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId=this.userData['data']['id'];
      this.userName=this.userData['data']['name'];
      this.tabActive('tab1');
    }
    
    backToList() {
      this._location.back();
    }
    
    tabActive(tab: any) {
      this.tabActiveType = {};
      this.tabActiveType[tab] = true;
    }
    
    
    ngOnInit() {
    }
    
    
    pervious(){
      this.start = this.start - this.page_limit;
      this.followupList();
    }
    
    nextPage(){
      this.start = this.start + this.page_limit;
      this.followupList();
    }
    
    
    refresh(){
      this.filter = {};
      this.followupList();
    }
    
    leadDetail()
    {
      this.loader = true;
      this.serve.post_rqst({'id': this.lead_id }, "Enquiry/enquiryDetail").subscribe(result => {
        if(result['statusCode'] == 200){
          this.lead_detail = result['enquiry_detail'];
          this.lead_logs = result['enquiry_detail']['log'];
          setTimeout(() => {
            this.loader = false;
          }, 700);
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
          this.loader = false;
        }
      })
    }
    
    
    openDialog(dr_type, value, company_name, name, type) {
      const dialogRef = this.dialog.open(LeadAddFollowupModelComponent, {
        width: '500px',
        panelClass:'cs-modal',
        data: {
          dr_type, 
          value,
          type,
          name,
          company_name,
          id: this.lead_id,
          state:this.lead_detail.state,
          'user_id':this.lead_detail.user_id
          
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != false){
          this.leadDetail();
          this.followupList();
        }
      });
    }
    
    followupList() {
      this.loader = true;
      if(this.pagenumber > this.total_page){
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      if(this.start<0){
        this.start=0;
      }
      
      
      if(this.filter.date_created)
      {
        this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD');
      }
      if(this.filter.next_follow_date)
      {
        this.filter.next_follow_date=moment(this.filter.next_follow_date).format('YYYY-MM-DD');
      }
      this.serve.post_rqst({ 'filter':this.filter, 'start': this.start,'pagelimit': this.page_limit,  'dr_id':this.lead_id, 'dr_type':this.lead_detail.type, 'dr_type_name':'Enquiry'}, "Enquiry/followupList").subscribe(result => {
        if(result['statusCode'] == 200){
          this.followup_list = result['result'];
          this.loader = false;
          this.pageCount = result['count'];
          if(this.pagenumber > this.total_page){
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else{
            this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
          }
          this.total_page = Math.ceil(this.pageCount/this.page_limit);
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit
          
          if (this.followup_list.length == 0) {
            this.data_not_found = true;
          } else {
            this.data_not_found = false;
          }
          
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
          this.loader = false;
        }
        
      }, error=>{
      })
    }
    
    changeStatus() {
      const dialogRef = this.dialog.open(ChangeEnquiryStatusComponent, {
        width: '600px',
        panelClass:'cs-modal',
        data:{
          'id': this.lead_id,
          'user_employee_code':this.lead_detail.user_employee_code,
          'user_id':this.lead_detail.user_id,
          'user_name':this.lead_detail.user_name,
          'dr_type':this.lead_detail.type
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != false){
          this.leadDetail();
          this.followupList();
        }
      });
    }
    lastBtnValue(value){
      this.fabBtnValue = value;
    }  
  }
  