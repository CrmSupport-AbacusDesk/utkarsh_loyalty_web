import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from '../localstorage.service';
import { AttendancemodalComponent } from '../attendancemodal/attendancemodal.component';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';
@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent implements OnInit {

  tabType: any = 'Today';
  tabType1: any = 'Present';
  data: any = {};
  start_attend_time: string;
  loader: boolean = false;
  datanotfound: boolean = false;
  value: any = {};
  att_temp: any = [];
  pagelimit: any;
  data_not_found = false;
  today_date: Date;
  today_day: any;
  show: boolean = false;
  newToday_date: string;
  logIN_user: any;
  uid: any;
  uname: any;
  pagenumber: any;
  total_page: any;
  count: any;
  start: any = 0;
  page_limit: any = 50
  assign_login_data2: any = {};
  assign_login_data: any = [];
  today_and_all_tab: any = 1;
  attendancelist: any = [];
  attendanceDate: any = [];
  show_today: boolean = true;
  count_1: any;
  count_2: any;
  count_3: any;
  absent: boolean = true;
  active_present_absent: boolean = true;
  attendence_type: any = 'Present';
  report_manager: any = [];
  totalAttendanceCount: any;
  tabCount: any = {};
  downurl: any = '';

  constructor(public rout: Router, public serve: DatabaseService, public dialog: DialogComponent, public toast: ToastrManager, public dialogs: MatDialog, public dialog2: MatDialog, public session: sessionStorage) {
    this.downurl = serve.downloadUrl;
    this.pagelimit = serve.pageLimit
    this.pagelimit = serve.pageLimit
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.getReportManager('');
    this.today_date = new Date();
    this.today_day = this.today_date.getDay();
    if (this.today_day == 5) {
      this.today_day = 'Friday'
    }


    switch (this.today_day) {
      case 0: {
        this.today_day = 'Sunday';
        break;
      }
      case 1: {
        this.today_day = 'Monday';

        break;
      }
      case 2: {
        this.today_day = 'Tuesday';

        break;
      }
      case 3: {
        this.today_day = 'Wednesday';

        break;
      }
      case 4: {
        this.today_day = 'Thursday';

        break;
      }
      case 5: {
        this.today_day = 'Friday';

        break;
      }
      case 6: {
        this.today_day = 'Saturday';

        break;
      }
      default: {
        break;
      }
    }
    this.newToday_date = moment(this.today_date).format('YYYY-MM-DD')
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    this.uid = this.logIN_user['data']['id'];
    this.uname = this.logIN_user['data']['name'];

  }

  ngOnInit() {
    this.data = this.serve.getData()
    if (this.data.status) {
      this.tabType1 = this.data.status
      this.tabType = this.data.tabType
    }
    this.attendance_list('getAttendanceToday', 1);

  }


  getReportManager(searcValue) {
    this.serve.post_rqst({ 'search': searcValue }, "Attendance/getSalesUserForReporting").subscribe((result => {
      if (result['all_sales_user']['statusCode'] == 200) {
        this.report_manager = result['all_sales_user']['all_sales_user']
      }
      else {
        this.toast.errorToastr(result['all_sales_user']['statusMsg'])
      }
    }));
  }


  pervious(fn_name, type) {
    this.start = this.start - this.page_limit;
    this.attendance_list(fn_name, type);
  }

  nextPage(fn_name, type) {
    this.start = this.start + this.page_limit;
    this.attendance_list(fn_name, type);
  }



  change_tab(fn_name, type) {
    this.attendancelist = [];
    this.data = {}
    if (type == 1) {
      this.attendence_type = 'Present';
      this.tabType1 = 'Present';
    }
    else {
      this.attendence_type = '';
    }
    this.attendance_list(fn_name, type);

  }
  change_attendence_type_tab(fn_name, type, attendenceType) {
    this.attendence_type = attendenceType;
    this.attendancelist = [];
    this.data = {};
    this.attendance_list(fn_name, type);
  }
  sales: any = [];
  refresh(func_name, type) {
    this.data = {};
    this.start = 0;
    this.attendance_list(func_name, type);
  }


  getTabCount() {
    this.serve.post_rqst({}, "Attendance/getAttendanceTodayCount").subscribe((response => {
      if (response['statusCode'] == 200) {
        this.tabCount = response['result']
      } else {
        this.toast.errorToastr(response['statusMsg'])
      }
    }));
  }


  attendance_list(func_name, type) {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.count_2 - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    if (Object.getOwnPropertyNames(this.data).length != 0) {
      this.attendancelist = [];
    }
    if (type == 1) {
      this.today_and_all_tab = 1;
    } else if (type == 2) {
      this.today_and_all_tab = 2;
    }
    if (this.data.date_created)
      this.data.date_created = moment(this.data.date_created).format('YYYY-MM-DD');
    if (this.data.date_from)
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    if (this.data.date_to)
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');


    this.data.status = this.tabType1
    this.data.tabType = this.tabType
    this.serve.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.pagelimit, 'search': this.data, 'user_type': this.assign_login_data2.type, 'attendence_type': this.attendence_type }, "Attendance/" + func_name)
      .subscribe(((result: any) => {
        if (result['statusCode'] == 200) {
          this.loader = false;
          this.attendancelist = result['result']['attendence_data'];
          this.totalAttendanceCount = result['result']['count'];

          this.attendanceDate = result['result']['Date'];
          if (this.attendancelist.length == 0) {
            this.datanotfound = true
          } else {
            this.datanotfound = false

          }

          for (let i = 0; i < this.attendancelist.length; i++) {
            this.attendancelist[i].date_created_day = moment(this.attendancelist[i].date_created, 'YYYY.MM.DD').format("dddd");
            this.attendancelist[i].today_primary_sales = parseFloat(this.attendancelist[i].today_primary_sales)
            this.attendancelist[i].today_primary_sales = this.attendancelist[i].today_primary_sales.toFixed(2)
          }

          for (let i = 0; i < this.attendancelist.length; i++) {
            for (let j = 0; j < this.attendancelist[i].length; j++) {
              if (this.attendancelist[i][j].stop_reading == "") {
                this.attendancelist[i][j].start_reading = parseInt(this.attendancelist[i][j].start_reading);
              }
              else {
                this.attendancelist[i][j].stop_reading = parseInt(this.attendancelist[i][j].stop_reading);
                this.attendancelist[i][j].start_reading = parseInt(this.attendancelist[i][j].start_reading);
              }
            }
          }
          this.att_temp = result;

          if (type == 1) {
            this.getTabCount();

            this.count_1 = this.attendancelist.length;
            this.count_2 = result['result']['count'];

            this.show_today = true;
            this.absent = false;
            this.total_page = Math.ceil(this.count_2 / this.page_limit);

            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;

          }
          else {
            this.count_3 = result.total_no_of_attendence;
            this.count_1 = result.count;
            this.count_2 = this.attendancelist.length;
            this.show_today = false;
            this.absent = false;
            this.count = result['count'];

            this.total_page = Math.ceil(this.totalAttendanceCount / this.page_limit);
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          if (this.attendence_type == 'Present') {

            this.active_present_absent = true;

          } else if (this.attendence_type == 'Absent') {

            this.active_present_absent = false;

          }
          if (this.attendancelist.length == 0) {
            this.data_not_found = true;
          }
          else {
            this.data_not_found = false;
          }
        } else {
          this.toast.errorToastr(result['statusMsg'])
          this.loader = false;
        }
      }))

  }

  leave: any
  excel_data: any = [];
  attendancelist1: any = []
  leave_type: any
  description: any

  downloadExcel(func_name, type) {
    this.serve.post_rqst({ 'user_id': this.assign_login_data2.id, 'search': this.data, 'user_type': this.assign_login_data2.type, 'attendence_type': this.attendence_type }, "Excel/" + func_name)
      .subscribe(((result: any) => {
        if (result['msg'] == true) {
          window.open(this.downurl + result['filename'])
          this.attendance_list('getAttendance', type);
        } else {

        }

      }));

  }

  imageModel(start_meter_image, stop_meter_image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      data: {
        start_meter_image,
        stop_meter_image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }
  conInt(val: any) {
    return val = parseFloat(val).toFixed(2);  //function convert data into float then number
  }
  conInt2(val: any) {
    return val = parseInt(val)                // function convert dataa into int
  }
  enable_error() {
    this.toast.errorToastr("Stop reading must be greater than Start reading");
  }
  attendancemodal(p) {
    const dialogRef = this.dialog2.open(AttendancemodalComponent, {
      panelClass: 'rightmodal',
      data: {
        p
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }


  attendancDetail(attendance_id, user_id, date) {
    const dialogRef = this.dialog2.open(AttendanceDetailComponent, {
      panelClass: 'full-width-modal',
      data: {
        'attendance_id': attendance_id,
        'user_id': user_id,
        'date': date,

      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }



  resetAttendance(id, fn_name, type) {
    this.dialog.confirm("You Want To  Reset Stop Attendance !").then((result) => {
      if (result) {
        this.serve.post_rqst({ 'id': id }, "Attendance/resetAttenance")
          .subscribe(resp => {
            if (resp['statusCode'] == 200) {
              this.toast.successToastr(resp['statusMsg']);
              this.attendance_list(fn_name, type);
            }
            else {
              this.toast.errorToastr(resp['statusMsg']);
            }
          })
      }
    })

  }

  markAbsent(attenData, fn_name, type) {
  
    this.dialog.confirm("You Want To  Mark Absent !").then((result) => {
      if (result) {
        this.serve.post_rqst({ 'id':attenData.id ,'manual_absent': attenData.manual_absent }, "Attendance/markAbsent")
          .subscribe(resp => {
            if (resp['statusCode'] == 200) {
              this.toast.successToastr(resp['statusMsg']);
              this.attendance_list(fn_name, type);
            }
            else {
              this.toast.errorToastr(resp['statusMsg']);
            }
          });
      }
    })
  }



}


