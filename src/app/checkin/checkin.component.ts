import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { __values } from 'tslib';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { sessionStorage } from '../localstorage.service';
import { CheckinViewComponent } from '../checkin-view/checkin-view.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CheckindocumentComponent } from '../checkindocument/checkindocument.component';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
  start_attend_time: string;
  loader: boolean = false;
  datanotfound = false;
  data: any = {};
  checkins: any = [];
  checkins_count: any = {};
  attendanceDate: any = [];
  show_today: boolean = true;
  assign_login_data2: any = [];
  assign_login_data: any = [];
  skelton: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  searchData: any;
  backButton: boolean = false;
  districtAppend: String;
  report_manager: any = [];
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  downurl: any = ''
  sr_no: number;
  
  
  
  
  constructor(public serve: DatabaseService, public navparams: ActivatedRoute, public location: Location, public route: Router,
    public dialog2: MatDialog, public session: sessionStorage , public toast :ToastrManager) {
      this.downurl = serve.downloadUrl;
      this.page_limit = serve.pageLimit;
      this.assign_login_data = this.session.getSession();
      this.assign_login_data = this.assign_login_data.value;
      this.assign_login_data2 = this.assign_login_data.data;
      this.getReportManager('');
      this.searchData = (this.navparams['params']['_value']);
      if (this.searchData.selectedUser && this.searchData.selectedDate) {
        this.backButton = true;
        if (this.searchData.selectedDate == this.today_date) {
          this.checkins = [];
          // this.data = {};
          this.data.user_name = this.searchData.selectedUser;
          this.CheckinList('todayCheckinList', 1);
        }
        else {
          this.checkins = [];
          this.data.user_name = this.searchData.selectedUser;
          this.data.date_created = this.searchData.selectedDate;
          this.CheckinList('get_all_checkin_new', 2);
        }
      }
      
      if (!this.searchData.selectedUser) {
        this.CheckinList('todayCheckinList', 1);
      }
      this.getNetworkType();
    }
    
    ngOnInit() { }
    
    pervious(type) {
      this.start = this.start - this.page_limit;
      if(type == 'todayCheckinList'){
        this.CheckinList('todayCheckinList', 1);
      }
      else{
        this.CheckinList('checkinAll', 1);
      }
    }
    
    nextPage(type) {
      this.start = this.start + this.page_limit;
      if(type == 'todayCheckinList'){
        this.CheckinList('todayCheckinList', 1);
      }
      else{
        this.CheckinList('checkinAll', 1);
      }
    }
    
    getReportManager(search) {
      this.serve.post_rqst({ 'search': search }, "Checkin/getSalesUserForReporting").subscribe((result => {
        if(result['all_sales_user']['statusCode'] == 200){
          this.report_manager = result['all_sales_user']['all_sales_user']
        }
        else{
          this.toast.errorToastr(result['all_sales_user']['statusMsg'])
        }
      }));
    }
    refresh(func_name, type,) {
      this.start = 0;
      this.data = {};
      this.CheckinList(func_name, type)
    }
    
    networkType: any = [];
    getNetworkType() {
      this.serve.post_rqst({ 'type': 'checkin' }, "Checkin/allNetworkModule").subscribe((result => {
        if(result['statusCode'] == 200){
          this.networkType = result['modules'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    
    CheckinList(func_name, type) {
      
      this.loader = true;
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      if(this.start<0){
        this.start=0;
      }
      this.serve.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.data, 'user_type': this.assign_login_data2.type }, "Checkin/" + func_name)
      .subscribe(((result: any) => {
        if(result['statusCode']==200){
          this.loader = false;
          if (func_name == 'checkinAll') {
            this.checkins_count = result['result'];
            this.checkins = (result['result']['checkin_data']);
            this.pageCount = result['count'];
            this.attendanceDate = result['result']['header_date'];
            this.show_today = false;

          }
          else {
            this.show_today = true;
            this.checkins = (result['result']);
            this.pageCount = result['count'];
          }
          for (let i = 0; i < this.checkins.length; i++) {
            this.checkins[i].order_grand_total = parseFloat(this.checkins[i].order_grand_total)
            this.checkins[i].order_grand_total = this.checkins[i].order_grand_total.toFixed(2)
            if (this.checkins[i].order_grand_total == "NaN") {
              this.checkins[i].order_grand_total = 0;
            }
          }


          if(this.pagenumber > this.total_page){
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else{
            this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
          }

          this.total_page = Math.ceil(this.pageCount / this.page_limit);
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;

          if (this.checkins.length == 0) {
            this.datanotfound = true;
          } else {
            this.datanotfound = false;
          }
          setTimeout(() => {
            this.loader = false;
            
          }, 100);
        }else{
          setTimeout(() => {
            this.loader = false;
          }, 100);
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }

    opendoc(list) {
      
      const dialogRef = this.dialog2.open(CheckindocumentComponent, {
        width: '768px',
        data: {
          list
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        
      });
      
    }

    
    
    change_tab(fn_name, type) {
      this.checkins = [];
      this.data = {};
      this.CheckinList(fn_name, type);
    }
    
    exportAsXLSX(func_name, type) {
      this.serve.post_rqst({ 'user_id': this.assign_login_data2.id, 'search': this.data, 'user_type': this.assign_login_data2.type }, "Excel/" + func_name)
      .subscribe(((result: any) => {
        if (result['msg'] == true) {
          window.open(this.downurl + result['filename'])
          this.CheckinList(func_name, type);
        }
      }));
      
    }
    
    checkinDetail(user_id, date) {
      const dialogRef = this.dialog2.open(CheckinViewComponent, {
        panelClass: 'full-width-modal',
        data: {
          'user_id': user_id,
          'date': date,
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
      });
      
    }
    
  }
  