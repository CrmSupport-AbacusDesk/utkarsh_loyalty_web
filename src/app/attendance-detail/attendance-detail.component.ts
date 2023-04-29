import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { sessionStorage } from '../localstorage.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html'
})
export class AttendanceDetailComponent implements OnInit {
  skLoading:boolean = false;
  attendance_data:any ={};
  checkin_data:any =[];
  url:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data, public dialogs: MatDialog, public toast: ToastrManager,public service: DatabaseService,public dialog: DialogComponent,public dialogRef: MatDialogRef<AttendanceDetailComponent>) {
    this.getDetails();
    this.url = this.service.uploadUrl + 'attendence/';
  }
  
  ngOnInit() {
   this.service.currentUserID = this.data.attendance_id 
  }
  
  close(){
    this.dialogRef.close();
  }
  
  getDetails(){
    this.skLoading = true;
    this.service.post_rqst({'attendance_id':this.data.attendance_id, 'user_id':this.data.user_id,'date':this.data.date}, "Attendance/attendenceForTravelDetail")
    .subscribe((result => {
      if(result['statusCode']==200){
      this.attendance_data = result['result'];
      this.checkin_data = this.attendance_data['check_in_data'];
      this.skLoading = false;
      }else{
        this.toast.errorToastr(result['statusMsg'])
        this.skLoading = false;
      }
    }))
  }
  
  
  goToImage(image)
  {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass:'Image-modal',
      data:{
        'image':image,
        'type':'base64'
      }});
      dialogRef.afterClosed().subscribe(result => {
        
      });
      
    }
  }
  