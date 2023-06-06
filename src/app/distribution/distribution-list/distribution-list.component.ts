import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-distribution-list',
  templateUrl: './distribution-list.component.html',
  animations: [slideToTop()]

})
export class DistributionListComponent implements OnInit {
  active_tab = 'Active';
  fabBtnValue: any = 'add';
  retailer_type = 'Dr';
  filter: any = {}
  excelLoader: boolean = false;
  pageCount: any;
  value: any = {};
  dr_list_temp: any = [];
  distributor_list: any = [];
  start: any = 0;
  count: any;
  sr_no: any;
  total_page: any;
  pagenumber: any = '';
  page_limit: any = 50
  exp_loader: any = false;
  loader: boolean = false;
  data: any = [];
  datanotfound = false;
  type: any;
  type_id: any;
  brand_master: any = [];
  state_values: any = [];
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {}
  today_date: Date;
  add: any = {};
  sort: any = {}
  delete: any = {};
  sorting_type: any = ''
  column: any = ''
  edit: any = {};
  assign_login_data2: any = [];
  all_count: any = {}

  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  downurl: any = ''


  constructor(public serve: DatabaseService, public toast: ToastrManager, public alert: DialogComponent, public route: Router, public ActivatedRoute: ActivatedRoute, public dialog: DialogComponent, public session: sessionStorage, public alrt: MatDialog) {
    this.downurl = serve.downloadUrl;
    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
  }

  ngOnInit() {
    this.filter = this.serve.getData()
    if (this.filter.active_tab) {
      this.active_tab = this.filter.active_tab
    }
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);

    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }

    this.ActivatedRoute.params.subscribe(params => {
      this.type_id = params.id;
      this.type = params.type;
      this.distributorList('', this.column, this.sorting_type);
    });

  }


  lastBtnValue(value) {
    this.fabBtnValue = value;
  }



  dr_count: any;

  date_format(): void {

    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.distributorList('', this.column, this.sorting_type);
  }
  pervious() {
    this.start = this.start - this.page_limit;
    this.distributorList('', this.column, this.sorting_type);
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.distributorList('', this.column, this.sorting_type);
  }

  distributorList(action: any = '', column, sorting_type) {
    if (action == "refresh") {
      this.filter = {};
      this.dr_list_temp = [];
      this.start = 0;
    }
    this.distributor_list = [];


    if (this.sort.type1 == 'DESC') {
      this.sort.value = "company_name"
      this.sort.type = "DESC"

    }
    else if (this.sort.type1 == 'ASC') {
      this.sort.value = "company_name"
      this.sort.type = "ASC"
    }
    else {
      this.sort.value = "date_created"
      this.sort.type = "DESC"
    }

    this.loader = true;

    if (this.type_id == 3) {
      this.filter.active_tab = this.active_tab;
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    } if (this.start < 0) {
      this.start = 0
    }
    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter, 'type': this.type_id, 'column_name': this.column, 'sorting_type': this.sorting_type }, "CustomerNetwork/drList")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.dr_list_temp = result['distributor'];
          this.pageCount = result['count'];
          if (this.dr_list_temp.length == 0) {
            this.datanotfound = true
          } else {
            this.datanotfound = false

          }
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

          for (let i = 0; i < this.dr_list_temp.length; i++) {
            if (this.dr_list_temp[i].status == '1') {
              this.dr_list_temp[i].newStatus = true
            }
            else if (this.dr_list_temp[i].status == '0') {
              this.dr_list_temp[i].newStatus = false;

            }
          }
          this.loader = false;
        } else {
          this.toast.errorToastr(result['statusMsg']);
        }
      }))
  }


  // download excel

  excel_data: any = [];
  downloadExcel() {
    this.excelLoader = true;
    this.serve.post_rqst({ 'search': this.value, 'type': this.type_id, 'filter': this.filter, 'type_name': this.type }, "Excel/dr_list").subscribe((result) => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename']);
        this.excelLoader = false;
        this.distributorList('', this.column, this.sorting_type);

      } else {

      }

    }, err => {
      this.excelLoader = false;

    });
  }


  updateStatus(index, id, event) {
    if (event.checked == false) {
      this.alert.confirm("You Want To Change Status !").then((result) => {
        if (result) {
          if (event.checked == false) {
            this.dr_list_temp[index].status = "0";
          }
          else {
            this.dr_list_temp[index].status = "1";
          }
          let value = this.dr_list_temp[index].status;
          this.serve.post_rqst({ 'id': id, 'status': value, 'status_changed_by_id': this.assign_login_data2.id, 'status_changed_by_name': this.assign_login_data2.name }, "CustomerNetwork/drStatusChange")
            .subscribe(resp => {
              if (resp['statusCode'] == 200) {
                this.toast.successToastr(resp['statusMsg']);
                this.distributorList('', this.column, this.sorting_type);
              }
              else {
                this.toast.errorToastr(resp['statusMsg']);
              }
            })
        }
      })
    }
    else if (event.checked == true) {
      this.alert.confirm("You Want To Change Status !").then((result) => {
        if (result) {
          if (event.checked == false) {
            this.dr_list_temp[index].status = "0";

          }
          else {
            this.dr_list_temp[index].status = "1";

          }
          let value = this.dr_list_temp[index].status;
          this.serve.post_rqst({ 'id': id, 'status': value, 'status_changed_by_id': this.assign_login_data2.id, 'status_changed_by_name': this.assign_login_data2.name }, "CustomerNetwork/drStatusChange")
            .subscribe(resp => {
              if (resp['statusCode'] == 200) {
                this.toast.successToastr(resp['statusMsg']);
                this.distributorList('', this.column, this.sorting_type)
              }
              else {
                this.toast.errorToastr(resp['statusMsg']);
              }
            })
        }
      })
    }
  }

  upload_excel(type) {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'from': 'Distribution',
        'type': this.type_id,
        'modal_type': type,
        'filter_data': this.filter

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.distributorList('', this.column, this.sorting_type);
      }

    });
  }

  refresh() {
    this.filter = {};
    this.serve.setData(this.filter)
    this.filter.active_tab = this.active_tab;
    this.start = 0;
    this.serve.currentUserID = ''
    this.distributorList('', this.column, this.sorting_type);
  }
  userDetail(id) {
    this.route.navigate(['/distribution-detail/' + id]);
  }
  tmpsearch1: any = {};


  id: any;
  state: any;
  goTODetail(id, state, type) {
    this.route.navigate(['/distribution-detail/' + id], { queryParams: { state, id, type } });
  }


  resetDevice(index, id) {
    this.alert.confirm("You Want To  Reset Device !").then((result) => {
      if (result) {
        this.serve.post_rqst({ 'id': id, 'type': 'customer' }, "CustomerNetwork/resetDeviceId")
          .subscribe(resp => {
            if (resp['statusCode'] == 200) {
              this.toast.successToastr(resp['statusMsg']);
              this.distributorList('', this.column, this.sorting_type);
            }
            else {
              this.toast.errorToastr(resp['statusMsg']);
            }
          })
      }
    })

  }

}
