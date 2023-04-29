import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-attendancemodal',
  templateUrl: './attendancemodal.component.html',
  styleUrls: ['./attendancemodal.component.scss']
})
export class AttendancemodalComponent implements OnInit {
  id:any;
  dist_list:any=[];
  total_distance:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public navparams: ActivatedRoute,public serve: DatabaseService) {
    this.id=this.data.p.id;
    console.log(this.id);
    this.get_attendance_data();

  }

  ngOnInit() {
  }

  get_attendance_data()
  {
    this.serve.post_rqst({'id':this.id},"Attendance/getDistanceDetail").subscribe((result) => {
      console.log(result);
      this.dist_list=result['distance_data'];
      this.total_distance=result['total_distance'];
      console.log( this.dist_list);
      console.log( this.total_distance);


    });
  }
}
