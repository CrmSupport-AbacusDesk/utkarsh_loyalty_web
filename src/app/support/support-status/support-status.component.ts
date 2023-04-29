import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-support-status',
  templateUrl: './support-status.component.html'
})
export class SupportStatusComponent implements OnInit {
  data:any ={}
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName: any;
  
  
  constructor(@Inject(MAT_DIALOG_DATA) public modelData, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager,public alert : DialogComponent , public dialogRef: MatDialogRef<SupportStatusComponent>) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }
  
  
  ngOnInit() {
  }
  
  
  submit() {
    this.savingFlag = true;
    this.data.id = this.modelData.id;
    this.data.created_by_id = this.userId;
    this.data.created_by_name = this.userName;
    this.serve.post_rqst({ 'data': this.data}, "Support/closeComplaint").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
      
    }))
    
  }
  
}
