import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-checkin-view',
  templateUrl: './checkin-view.component.html'
})
export class CheckinViewComponent implements OnInit {
  skLoading:boolean = false;
  user_details:any ={};
  attedence_data:any ={}
  check_in_data:any =[];
  array :any =[]
  constructor(@Inject(MAT_DIALOG_DATA)public data, public dialogs: MatDialog, public toast: ToastrManager,public service: DatabaseService,public dialog: DialogComponent,public dialogRef: MatDialogRef<CheckinViewComponent>) {
    this.array = new Array(10);
    this.getDetails();
  }
  
  ngOnInit() {
  }
  
  close(){
    this.dialogRef.close();
  }
  
  
  getDetails(){
    this.skLoading = true;
    this.service.post_rqst({'id':this.data.user_id,'date':this.data.date}, "Checkin/checkinDetail")
    .subscribe((result => {
      if(result['statusCode']==200){
      this.user_details  = result['result'];
      this.attedence_data = this.user_details.attedence_data;
      this.check_in_data = this.attedence_data.check_in_data;
      this.skLoading = false;
      }else{
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  
}
