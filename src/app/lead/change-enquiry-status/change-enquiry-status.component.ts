import { Component, OnInit, Inject} from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { ProductUploadComponent } from 'src/app/product-upload/product-upload.component';

@Component({
  selector: 'app-change-enquiry-status',
  templateUrl: './change-enquiry-status.component.html'
})
export class ChangeEnquiryStatusComponent implements OnInit {
  data:any ={};
  report_manager:any =[];
  // followupData: any=[];
  date:any;
  userData: any;
  userId: any;
  savingFlag:boolean = false;
  userName: any;
  enquiry_id:any;
  
  
  constructor(@Inject(MAT_DIALOG_DATA)public modal_data, public dialog: DialogComponent, public service:DatabaseService, public rout: Router, public toast:ToastrManager, public dialogRef: MatDialogRef<ChangeEnquiryStatusComponent>) { 
    console.log('====================================');
    console.log(modal_data);
    console.log('====================================');
    this.data.dr_type = this.modal_data.dr_type;
    this.data.dr_type_name = 'Enquiry';
    this.date = new Date();
    this.data.create_follow_up = 'No';
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.userName=this.userData['data']['name'];
    
  }
  
  ngOnInit() {
    
  }
  
  public onDate(event): void 
  {
    // this.orderList();
  }
  
  
  // get_followup_types(){
  //   this.service.post_rqst({}, "Distributors/followup_type_master_list").subscribe((result) => {
  //     this.followupData = result['followup_type_master_list'];
      
  //   })
  // }
  getReportManager(searcValue) {
    this.service.post_rqst({'search':searcValue}, "Enquiry/getSalesUserForReporting").subscribe((response => {
      if(response['all_sales_user']['statusCode'] == 200){
        this.report_manager = response['all_sales_user']['all_sales_user'];
      }
      else{
        this.toast.errorToastr(response['all_sales_user']['statusMsg']);
      }
    }));
  }


  findUser(id){
    let index=  this.report_manager.findIndex(row=>row.id==id)
    if(index!= -1){
      this.data.user_name= this.report_manager[index].name;
    }
  }
  
  
  submitDetail(){
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    this.data.dr_id = this.modal_data.id;
    this.data.enquiry_id = this.modal_data.id;
    this.data.user_employee_code = this.modal_data.user_employee_code;
    this.data.next_followup_date = moment(this.data.next_followup_date).format('YYYY-MM-DD');
    this.savingFlag = true;
    if(this.data.lead_status == 'Disqualified'){
      this.data.create_follow_up = 'No'
    }
    
    this.service.post_rqst(this.data,'Enquiry/enquiryStageChange').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close();
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    }, error => {
    })
    
  }
  
}
