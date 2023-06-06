import { Component, Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-lead-add-followup-model',
  templateUrl: './lead-add-followup-model.component.html'
})
export class LeadAddFollowupModelComponent implements OnInit {
  
  userCheck: any = [];
  dr_id: any;
  company_name: any = {};
  asmList: any = [];
  followUp: any = {};
  today_date: any = {};
  followup_types: any=[];
  active:any={};
  userData:any;
  userId:any;
  userName:any;
  report_manager:any =[];
  savingFlag:boolean = false;
  
  
  constructor( @Inject(MAT_DIALOG_DATA) public data, public serve: DatabaseService, public dialog: DialogComponent, public dialog2: MatDialog, public toast:ToastrManager) {
    this.followUp.leadType = data['type'];
    this.followUp.dr_id = data['id'];
    this.followUp.dr_id = data['id'];
    this.followUp.dr_name = data['name'];
    this.followUp.dr_type = data['dr_type'];
    this.followUp.user_id = data['user_id'];
    this.followUp.company_name = data['company_name'];
    this.followUp.state = data['state'];
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.getReportManager('');
    this.today_date = new Date().toISOString().slice(0, 10);
  }
  
  ngOnInit() {
    this.get_followup_types()
  }
  
  

  getReportManager(searcValue) {
    this.serve.post_rqst({'search':searcValue}, "Enquiry/getSalesUserForReporting").subscribe((response => {
      if(response['all_sales_user']['statusCode'] == 200){
        this.report_manager = response['all_sales_user']['all_sales_user'];
      }
      else{
        this.toast.errorToastr(response['all_sales_user']['statusMsg']);
      }
    }));
  }
  
  
  
  submitFollowUp() {
    this.followUp.next_followup_date = moment(this.followUp.followup_date).format('YYYY-MM-DD');
    this.userCheck = false;
    this.savingFlag = true;
    this.serve.post_rqst({'uid':this.userId, 'uname':this.userName, 'dr_id':this.followUp.dr_id, 'dr_type':this.followUp.dr_type, 'dr_type_name':'Enquiry',  'follow_type':this.followUp.followup_type, 'user_id':this.followUp.user_id, 'followup_time':this.followUp.followup_time, 'followup_date':this.followUp.next_followup_date, 'remarks':this.followUp.remarks}, "Enquiry/addFollowup").subscribe((result => {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);

      }
    }))
    
  }
  
  submitActivity() {
    this.userCheck = false;
    this.savingFlag = true;
    this.serve.post_rqst({'uid':this.userId, 'uname':this.userName, 'dr_id':this.followUp.dr_id, 'dr_name':this.followUp.dr_name, 'dr_type':this.followUp.dr_type, 'remarks':this.followUp.activity_remark}, "Enquiry/addEnquiryActivity").subscribe((result => {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
    
  }
  
  
  get_followup_types(){
    this.serve.post_rqst({}, "Distributors/followup_type_master_list").subscribe((result) => {
      this.followup_types = result['followup_type_master_list']
    })
  }
  
}
