import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { TravelStatusModalComponent } from '../travel-status-modal/travel-status-modal.component';
import { addTravelListModal } from '../add-travel-list/add-travel-list-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';



@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html'
})
export class TravelListComponent implements OnInit {
  active_tab: any = 'Pending';
  travel_list: any = [];
  loader: boolean = false;
  search: any = {};
  skelton: any;
  datanotfound = false;
  status: any = {};
  travel_list1: any = [];
  travel_list2: any = [];
  count_list: any = [];
  table_head: boolean = false;
  today_date: Date;
  assign_login_data2: any = [];
  report_manager: any = [];
  count: any = {}
  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  data: any = {}
  tmpsearch: string
  asmList: any = []
  secondary_lead_list: any = [];
  sr_no: any = 0;
  total_page: any;
  pageCount: any;
  page_limit: any = 20;
  pagenumber: any = 1;
  start: any = 0;
  downurl: any = '';


  constructor(public alert: DialogComponent, public route: Router, public serve: DatabaseService, public dialog1: DialogComponent, public alrt: MatDialog, public dialog: MatDialog, public session: sessionStorage, public toast: ToastrManager,) {
    this.downurl = serve.downloadUrl;
    this.skelton = new Array(10);
    this.getReportManager('');
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.today_date = new Date();
  }

  ngOnInit() {
    this.search = this.serve.getData()
    this.travel_list2;
    this.getTravelList();

  }

  upload_excel() {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      data: {
        'from': 'travel',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  filter_dr(dr_name) {
    this.tmpsearch = '';
    this.asmList = [];
    for (var i = 0; i < this.secondary_lead_list.length; i++) {
      dr_name = dr_name.toLowerCase();
      this.tmpsearch = this.secondary_lead_list[i]['name'].toLowerCase();
      if (this.tmpsearch.includes(dr_name)) {
        this.asmList.push(this.secondary_lead_list[i]);
      }
    }
  }
  refresh() {
    this.start = 0;
    this.pagenumber = 1;
    this.search = {}
    this.serve.setData(this.search)
    this.serve.currentUserID = ''
    this.data = {};
    this.getTravelList();
  }


  pervious() {
    this.start = this.start - this.page_limit;
    this.getTravelList();
  }

  nextPage() {

    this.start = this.start + this.page_limit;
    this.getTravelList();
  }
  getTravelList() {
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }

    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    this.search.status = status;
    this.serve.post_rqst({
      'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'data': this.data, 'search': this.search, 'user_type': this.assign_login_data2.type
    }, "Travel/travelList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.travel_list = result['user_list_travel_plan'];
        this.loader = false;
        if (this.travel_list.length == 0) {
          this.datanotfound = true
        } else {
          this.datanotfound = false
        }
        this.pageCount = result['count']
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })
  }

  public onDate(event): void {
    if (this.search.date_created) {
      this.search.travel_date = moment(event.value).format('YYYY-MM-DD');

    }
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }



    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');

    }

    this.getTravelList();

  }

  getReportManager(search) {
    this.serve.post_rqst({ 'search': search }, "Travel/getSalesUserForReporting").subscribe(response => {
      if (response['all_sales_user']['statusCode'] == 200) {
        this.report_manager = response['all_sales_user']['all_sales_user']
      } else {
        this.loader = false;
        this.toast.errorToastr(response['all_sales_user']['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    });
  }

  statusModal(id, date) {



    const dialogRef = this.dialog.open(TravelStatusModalComponent, {
      width: '400px',
      panelClass: 'cs-modal',
      data: {
        id,
        date
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.getTravelList();
    });

  }

  districtAppend: String;
  state4xl: String;
  cityexcel: String;

  area: any
  areaexcel: any;
  company_name: String;


  openEditDialog2(row): void {
    const dialogRef = this.dialog.open(addTravelListModal, {
      width: '720px', data: {
        row,

      }

    });

    dialogRef.afterClosed().subscribe(result => {

      this.getTravelList()

    });
  }

  addTravelPlan() {
    const dialogRef = this.dialog.open(addTravelListModal, {
      width: '720px',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTravelList();
      setTimeout(() => {
        this.loader = false;
      }, 100);

      if (result != false) {
        this.active_tab = 'Approved'
        this.getTravelList();
      }
      else {
        this.active_tab = 'Pending'
        this.getTravelList();
      }

    });


  }



  exportAsXLSX(status) {
    this.search.status = status;
    this.serve.post_rqst({
      'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'data': this.data, 'search': this.search, 'user_type': this.assign_login_data2.type
    }, "Excel/travel_list").subscribe((result => {

      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getTravelList();
      } else {

      }

    }));

  }

  goTODetail(id, month, year) {
    this.route.navigate(['/travel-sub-detail/' + id], { queryParams: { id, month, year } });
  }

  openTravelListModal(type) {
    const dialogRef = this.dialog.open(UploadFileModalComponent, {
      width: '720px',
      panelClass: 'cs-modal',
      data: {
        'from': 'Travel Plan',
        'modal_type': type
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getTravelList();
    })
  }


}
