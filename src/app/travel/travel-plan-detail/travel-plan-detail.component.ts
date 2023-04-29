import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';




@Component({
  selector: 'app-travel-plan-detail',
  templateUrl: './travel-plan-detail.component.html',
  styleUrls: ['./travel-plan-detail.component.scss']
})
export class TravelPlanDetailComponent implements OnInit {
  skLoading:boolean = false;
  travellist:any;
  travelData:any ={};
  cus_network:any =[];
  checkin:any =[];

  traveldistributor:any;
  travelarea:any;
  travel_id:any;
  travel_date:any;
  travel_month:any;
  travel_year:any;
  check_in_data:any=[]
  constructor(public alert:DialogComponent, public toast:ToastrManager, public serve:DatabaseService, public dialog: MatDialog, public rout: Router, public route:ActivatedRoute,private _location: Location ) { 
    this.skLoading = true;
    this.route.params.subscribe(params => {
      this.travel_id=route.params['_value'].id;
      this.serve.currentUserID = route.params['_value'].id
      console.log(this.serve.currentUserID)
      this.travel_date = this.route.queryParams['_value']['date'];
      this.travel_month = this.route.queryParams['_value']['currentMonth'];
      this.travel_year = this.route.queryParams['_value']['currentYear'];
      
    });
    
    
    this.travelDetail()
  }
  
  ngOnInit() {
    
    
  }
  backToList() {
    this._location.back();
  }
  
  
  travelDetail(){
    this.serve.post_rqst({'User_id':this.travel_id, 'Travel_date':this.travel_date},"Travel/travelPlanDetail").subscribe(result=>
      {
        if(result['statusCode']== 200 ){
          this.skLoading = false;
          this.travelData = result['']
          this.travellist = result['result']['tarvel_plan_detail'];
          this.cus_network = result['result']['distributor_network'];
          this.checkin = result['result']['checkin_data'];

        }
        else{
          this.skLoading = false;
          let id = this.travel_id;
          let year = this.travel_year;
          let month = this.travel_month;
          this.toast.errorToastr(result['statusMsg']);
          this.rout.navigate(['/travel-sub-detail/'+this.travel_id],{ queryParams: { id,month,year}});
        }
        
      }, err=>{
          this.skLoading = false;
          this.toast.errorToastr('Something went wrong');
          
      })
    }
    
    
    travelCheckin(){
      this.serve.post_rqst({'travel_id':this.travel_id, 'travel_date':this.travellist.date_from, 'user_id':this.travellist.assign_to},"Travel/travel_detail_checkin_list").subscribe((result=>
        {
          console.log(result);
        }))
      }
      
      
      
    }
    