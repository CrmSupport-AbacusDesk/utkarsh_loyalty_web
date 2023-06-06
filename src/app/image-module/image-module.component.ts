import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';

@Component({
  selector: 'app-image-module',
  templateUrl: './image-module.component.html',
  styleUrls: ['./image-module.component.scss']
})
export class ImageModuleComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AttendanceDetailComponent>) { 
    console.log(data);
    
  }
  ngOnInit() {
  }


  close(){
    this.dialogRef.close();
  }

}
