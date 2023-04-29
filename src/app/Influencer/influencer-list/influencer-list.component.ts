import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';


@Component({
  selector: 'app-influencer-list',
  templateUrl: './influencer-list.component.html'
})
export class InfluencerListComponent implements OnInit {
  filter: any = {};
  type: any = '';
  active_tab: any = 'Pending';
  network: any = '';
  Influencer_List: any = [];
  loader: boolean = false;
  datanotfound: boolean = false;
  page_limit: any;
  start: any = 0;
  pagenumber: any = 1;
  total_page: any;
  pageCount: any;
  sr_no: any = 0;
  tab_count: any;
  sorting_type: any = ''
  login_data: any = {};
  login_data5: any = {};
  logined_user_data: any = {};
  assign_login_data: any = {};
  today_date: Date;
  downurl: any = '';
  constructor(public alert: DialogComponent, public ActivatedRoute: ActivatedRoute, public toast: ToastrManager, public service: DatabaseService, public route: Router, public dialog: MatDialog, public session: sessionStorage) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value;
    this.today_date = new Date();

    this.ActivatedRoute.params.subscribe(params => {
      this.type = params.type;
      this.network = params.network;
      this.getRights();


    });
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.status) {
      this.active_tab = this.filter.status
    }

  }


  checkRight: any = {};
  getRights() {
    this.service.post_rqst({ 'type_id': this.type }, 'Influencer/scanningRightsCheck').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.checkRight = resp['result'];
        console.log(this.checkRight['point_transfer_right'])
        console.log(this.checkRight['scanning_rights'])
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
      this.InfluencerList();
    })
  }

  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.InfluencerList();
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.InfluencerList();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.InfluencerList();
  }

  InfluencerList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if(this.type=='3'){
      this.active_tab='Approved';
    }

    this.filter.status = this.active_tab;
    this.filter.sort_by_wallet = this.sorting_type;

    if (this.active_tab == 'Approved' && this.type==3) {
      this.filter.login_status = parseInt(this.filter.login_status);
    }

  this.service.post_rqst({ 'type': this.type, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/influencerCustomerList').subscribe((resp) => {

      if (resp['statusCode'] == 200) {
        this.Influencer_List = resp['result'];
        this.loader = false;
        this.pageCount = resp['count'];
        this.tab_count = resp['tab_count'];



        for (let i = 0; i < this.Influencer_List.length; i++) {
          if (this.Influencer_List[i].login_status == 1) {
            this.Influencer_List[i].user_status = true
          }
          else if (this.Influencer_List[i].login_status == 0) {
            this.Influencer_List[i].user_status = false;

          }
        }

        if (this.Influencer_List.length == 0) {
          this.datanotfound = true;
        } else {
          this.datanotfound = false;
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


        setTimeout(() => {
        }, 700)
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }




  updateStatus(index, id, event) {
    if (event.checked == false) {
      this.alert.confirm("You Want To Change Status !").then((result) => {
        if (result) {
          if (event.checked == false) {
            this.Influencer_List[index].login_status = 0;
          }
          else {
            this.Influencer_List[index].login_status = 1;
          }
          let value = this.Influencer_List[index].login_status;
          this.service.post_rqst({ 'id': id, 'login_status': value, 'status_changed_by_id': this.logined_user_data.data.id, 'status_changed_by_name': this.logined_user_data.data.name }, "Influencer/disableInfluencer")
            .subscribe(resp => {
              if (resp['statusCode'] == 200) {
                this.toast.successToastr(resp['statusMsg']);
                this.InfluencerList();
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
            this.Influencer_List[index].login_status = 0;
          }
          else {
            this.Influencer_List[index].login_status = 1;
          }
          let value = this.Influencer_List[index].login_status;
          this.service.post_rqst({ 'id': id, 'login_status': value, 'status_changed_by_id': this.logined_user_data.data.id, 'status_changed_by_name': this.logined_user_data.data.name }, "Influencer/disableInfluencer")
            .subscribe(resp => {
              if (resp['statusCode'] == 200) {
                this.toast.successToastr(resp['statusMsg']);
                this.InfluencerList();
              }
              else {
                this.toast.errorToastr(resp['statusMsg']);
              }
            })
        }
      })
    }
  }

  refresh() {
    this.filter = {};
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.InfluencerList();
  }



  Addnew() {
    let network = this.network
    let type = this.type
    this.route.navigate(['/add-influencer/'], { queryParams: { type, network } });
  }


  downloadExcel() {
    this.filter.status = this.active_tab;
    this.filter.influencer_type=this.network
    this.service.post_rqst({ 'filter': this.filter }, "Excel/influencer_list").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
      } else {
      }
    }));
  }


  public onDate(event) {
    console.log(event);
    this.filter.date_created = moment(event.target.value).format('YYYY-MM-DD');
    this.InfluencerList();
  }


}
