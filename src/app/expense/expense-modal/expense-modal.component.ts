import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog,MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import {  sessionStorage} from 'src/app/localstorage.service';


@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
  styleUrls: ['./expense-modal.component.scss']
})
export class ExpenseModalComponent implements OnInit 
{
  userData: any;
  userId: any;
  loader:any;
  userName: any;
  assign_login_data:any={};
  logined_user_data:any={};

  constructor(@Inject(MAT_DIALOG_DATA)public data,
  public session: sessionStorage,
  public serve:DatabaseService,
  public dialog:MatDialog,
  public rout:Router,
  public alert:DialogComponent,
  public toast:ToastrManager) 
  {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }
  
  ngOnInit() {
  }

update_status(){ 
    
  
  if(this.data['approved_amount'] == ''){
    
    delete this.data.approved_amount;
  } 
  else if (this.data['reason'] == ''){
    
    delete this.data.reason;
  }
  this.data.created_by_id=this.userId;
  this.data.created_by_name=this.userName;
  
  if(this.data.type == 'acStatus' && (Number(this.data['approved_amount']) > Number(this.data.totalAmt))){
    this.toast.errorToastr("Entered amount can't be greater than Claim Amount!");
  }
  else{
    this.serve.post_rqst(this.data,"Expense/updateStatus").subscribe((result)=>{
      
      if(result['statusCode']==200)
      {
        this.toast.successToastr(result['statusMsg']);
        this.dialog.closeAll();
      }else{
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  
  
// }else{
//   this.toast.errorToastr("Entered amount can't be greater than Claim Amount !")
// }

}
}
