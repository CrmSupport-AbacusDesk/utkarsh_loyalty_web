import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { TravelStatusModalComponent } from '../travel-status-modal/travel-status-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-travel-sub-detail',
  templateUrl: './travel-sub-detail.component.html'
})
export class TravelSubDetailComponent implements OnInit {
  loader:boolean = false;
  currentMonth: any;
  currentYear: any;
  TodayDate = new Date().toISOString().slice(0, 10);
  monthNames: string[];
  date: any;
  currentMonth_no: any;
  userId: any
  dateArray: any = [];
  travel_data: any = {}
  percentages: any = 0;
  daysInThisMonth: any = [];
  daysInLastMonth: any = [];
  daysInNextMonth: any = [];
  travel_id:any;
  user_detail:any ={};
  travel_plan:any =[];
  day_count:any
  assign_login_data:any;
  assign_login_data2:any;
  skLoading:boolean = false;
  
  constructor(public toast: ToastrManager, public service:DatabaseService, public dialog: MatDialog,  public dialog1:DialogComponent,public router: Router, public route:ActivatedRoute, public session: sessionStorage) { 
    this.date = new Date();
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.route.params.subscribe(params => {
      this.travel_id = params.id;
      this.service.currentUserID = params.id
      this.userId = params.id;
      this.currentMonth = this.route.queryParams['_value']['month'];
      this.currentYear = this.route.queryParams['_value']['year'];
      
    });
    
    this.travelDetail();
    
  }
  
  ngOnInit() {
  }
  
  
  goToLastMonth() {
    this.date = new Date(this.currentYear, this.currentMonth_no, 0);
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();
    
    this.travelDetail();
  }
  
  goToNextMonth() {
    this.date = new Date(this.currentYear, this.currentMonth_no + 2, 0);
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();
    this.travelDetail();
  }
  
  travelDetail() {
    this.skLoading = true;
    this.service.post_rqst({'Month':this.currentMonth_no + 1, 'Year':this.currentYear, 'User_id':this.travel_id}, "Travel/getTravelData").subscribe(result => {
      if(result['statusCode']==200){
        this.skLoading = false;
        this.user_detail = result['user_detail'];
        this.dateArray = result['dateArray'];
        this.day_count = result['tavel_date'];
        this.travel_plan = result['dateArray']
        this.percentages = Math.round((this.day_count.travel_plan / this.day_count.working_days) * 100);
        this.getDaysOfMonth();
      }else{
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg']);
      }
      
    }, err=>{
      this.toast.errorToastr('Something went wrong');
    })
  }
  
  getDaysOfMonth() {
    console.log('getDaysOfMonth call');
    
    let i
    this.daysInThisMonth = [];
    this.daysInLastMonth = [];
    this.daysInNextMonth = [];
    
    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    firstDayThisMonth == 0 ? firstDayThisMonth = 6 : firstDayThisMonth = (firstDayThisMonth - 1);
    
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    
    for (i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }
    
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    
    for (i = 0; i < thisNumOfDays; i++) {
      let month = ((this.currentMonth_no + 1) < 10) ? '0' + (this.currentMonth_no + 1) : (this.currentMonth_no + 1)
      let date = ((i + 1) < 10) ? '0' + (i + 1) : (i + 1)
      let fulldate = this.date.getFullYear() + '-' + month + '-' + date
      console.log(this.dateArray);
      
      let date_data = this.dateArray.filter(x => x.date === fulldate)[0];
      console.log(date_data);
      
      this.daysInThisMonth[i] = { 'day': i + 1, 'date': fulldate, 'day_name': date_data.day, 'isHoliday': date_data.isHoliday, 'isOnLeave': date_data.isOnLeave, 'isSunday': date_data.isSunday, 'travlePlan': date_data.travlePlan, 'collapse': false, 'travel_info': date_data.travel_info, 'travel_planstatus': date_data.travel_planstatus };
    }
    
    
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    
    if (lastDayThisMonth > 0) {
      for (i = 0; i < (7 - lastDayThisMonth); i++) {
        this.daysInNextMonth.push(i + 1);
      }
    }
    
    
    
  }
  
  
  
  goTODetail(date){
    let User_id = this.travel_id;
    let currentMonth = this.currentMonth;
    let currentYear = this.currentYear;
    this.router.navigate(['/travel-detail/'+User_id],{ queryParams: { date,User_id,currentYear,currentMonth}});
  }
  
  
  statusModal(id,date) {
    console.log(date);
    
    
    const dialogRef = this.dialog.open(TravelStatusModalComponent, {
      width: '400px',
      panelClass:'cs-modal',
      data: {
        id,
        date
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.travelDetail();
    });
    
  }
  
}
