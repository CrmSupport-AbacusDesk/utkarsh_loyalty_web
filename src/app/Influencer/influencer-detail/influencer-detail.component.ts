import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ChartType, ChartDataSets, ChartOptions, Chart } from 'chart.js';
import * as moment from 'moment';
import { UpdateKycComponent } from '../update-kyc/update-kyc.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AdvanceAddGiftComponent } from '../advance-add-gift/advance-add-gift.component';
import { Location } from '@angular/common'
import {  RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';



@Component({
  selector: 'app-influencer-detail',
  templateUrl: './influencer-detail.component.html'
})
export class InfluencerDetailComponent implements OnInit {
  @ViewChild('pieCanvas') private pieCanvas: ElementRef;
  pieChart: Chart;

  tabType: any = 'Profile';
  filter: any = {}
  Influencer_Detail: any = {};
  wallet_Detail: any = {}
  id: any = ''
  wallet_history_type: any = 'ledger'
  Tab_type ='self_purchase'
  pageCount: any;
  pagenumber: any = '';
  start: any = 0;
  total_page: any;
  page_limit: any;
  sr_no: any;
  skLoading: boolean = false;
  checkinLoader: boolean = false;
  loader: boolean = false;
  type_id: any;
  login_data: any = {};
  login_data5: any = {};
  url: any;
  user_assign_name: any = '';
  today_date: Date;



  constructor(public dialogs: MatDialog, public toast: ToastrManager, public dialog: MatDialog, public ActivatedRoute: ActivatedRoute, public service: DatabaseService, public route: Router, public session: sessionStorage, public location: Location) {
    this.page_limit = service.pageLimit;
    this.url = this.service.uploadUrl + 'influencer_doc/'
    this.today_date = new Date();

    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;
    this.ActivatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      this.type_id = params.type_id;



      if (this.id) {
        this.getRights();
        this.InfluencerDetail();
      }

    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }
  InfluencerDetail() {
    this.skLoading = true;
    this.filter.status = this.tabType
    this.service.post_rqst({ 'id': this.id, 'filter': this.filter }, 'Influencer/influencerCustomerDetail').subscribe((resp) => {

      if (resp['statusCode'] == 200) {
        this.Influencer_Detail = resp['result'];
        this.wallet_Detail = this.Influencer_Detail['influencer_data'];

        this.skLoading = false;
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }



  checkinData: any = [];

  clearFilter() {
    if (this.start < 0) {
      this.start = 0;
    }
  }


  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'Checkin') {
      this.getCheckin();
    }
    else if (type == 'advanceGIft') {
      this.getGift();
    }
    else if (type == 'purchase') {
      this.purchase_detail('filter');
    }
    else {

      if (this.wallet_history_type == 'ledger') {
        this.getLedger();
      }

      if (this.wallet_history_type == 'transfer point') {
        this.gettransferpoint();
      }

      if (this.wallet_history_type == 'scan_history') {
        this.scan_history_data();
      }
      else {
        this.redeem_history_data();
      }
    }
  }
  nextPage(type) {
    this.start = this.start + this.page_limit;
    if (type == 'Checkin') {
      this.getCheckin();
    }
    else if (type == 'advanceGIft') {
      this.getGift();
    }

    else if (type == 'purchase') {
      this.purchase_detail('filter');
    }
    else {

      if (this.wallet_history_type == 'ledger') {
        this.getLedger();
      }
      if (this.wallet_history_type == 'transfer point') {
        this.gettransferpoint();
      }
      if (this.wallet_history_type == 'scan_history') {
        this.scan_history_data();
      }
      else {
        this.redeem_history_data();
      }
    }
  }

  ledgerData: any = [];

  date_format(): void {
    if(this.wallet_history_type== 'ledger'){
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      this.getLedger();

    }

    if(this.wallet_history_type== 'transfer point'){
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      this.gettransferpoint();

    }


  }

  refresh() {
    if (this.start < 0) {
      this.start = 0;
    }
    this.filter = {};
    if(this.wallet_history_type== 'ledger'){
    this.getLedger();
    }
    if(this.wallet_history_type== 'transfer point'){
      this.gettransferpoint();
      }

       if (this.tabType == 'purchase') {
        this.purchase_detail('filter');
      }
  }



  checkRight: any = {};
  getRights() {
    this.service.post_rqst({ 'type_id': this.type_id }, 'Influencer/scanningRightsCheck').subscribe((resp) => {
      this.checkRight = resp['result'];
    })
  }

  getLedger() {
    this.filter.status = this.tabType;
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.service.post_rqst({ 'id': this.id, 'type': 'influencer', 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/influencerLedger').subscribe((resp) => {

      if (resp['statusCode'] == 200) {
        this.ledgerData = resp['influencer_ledger'];
        this.loader = false;
        this.pageCount = resp['count'];
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
        }, 700);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }

  transferPointData:any=[];
  gettransferpoint() {
    this.filter.status = this.tabType;
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.service.post_rqst({ 'id': this.id, 'type': 'retailer', 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/retailerLedger').subscribe((resp) => {

      if (resp['statusCode'] == 200) {
        this.transferPointData = resp['influencer_ledger'];
        this.loader = false;
        this.pageCount = resp['count'];
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
        }, 700);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }

  getCheckin() {
    this.checkinLoader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    let payLoad = { "filter": this.filter, "id": this.id, 'start': this.start, 'pagelimit': this.page_limit }
    this.service.post_rqst(payLoad, "Influencer/influencerCheckinList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.checkinData = result['influencer_checkin_list'];
        this.checkinLoader = false;
        this.pageCount = result['count'];
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
        this.checkinLoader = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    });
  }



  giftData: any = [];
  getGift() {
    this.checkinLoader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    let payLoad = { "filter": this.filter, "id": this.id, 'start': this.start, 'pagelimit': this.page_limit }
    this.service.post_rqst(payLoad, "GiftGallery/manualGiftGalleryList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.giftData = result['gift_master_manual_list'];
        this.checkinLoader = false;
        this.pageCount = result['count'];
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
        this.checkinLoader = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    });
  }


  redeemHistory: any = [];
  noResult: boolean = false;

  redeem_history_data() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;

    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    this.filter.id = this.Influencer_Detail.id;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/redeemHistory').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.redeemHistory = resp['result']
        this.pageCount = resp['count'];
        this.loader = false;


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
          if (this.redeemHistory.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }

    })
  }

  purchaseDate_format(): void
  {
      if(this.filter.date_created){
        this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD');
        this.purchase_detail('');
      }
      else if(this.filter.bill_date){
        this.filter.bill_date=moment(this.filter.bill_date).format('YYYY-MM-DD');
        this.purchase_detail('');

      }

  }



  purchaseDetail:any=[];
  purchase_detail(filter) {

    if(filter=='filter'){
    this.filter={};
    }

    if(this.Influencer_Detail.influencer_type=='Distributor'){
      this.Tab_type='other_purchase';
    }
    if(this.Influencer_Detail.influencer_type =='Plumber'){
      this.Tab_type='self_purchase';
    }

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if(this.Tab_type=='self_purchase'){
    this.filter.influencer_id = this.Influencer_Detail.id;
    }
     else {
      this.filter.against_influencer_id = this.Influencer_Detail.id;
      }



      this.filter.status=this.filter.status;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'RetailerRequest/get_retailer_request').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.purchaseDetail = resp['request_list']
        this.pageCount = resp['count'];
        this.loader = false;

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
          if (this.redeemHistory.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
         this.filter={};

      }

    })
  }

  couponData: any = [];

  scan_history_data() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    this.loader = true;
    this.filter.id = this.Influencer_Detail.id;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/scanHistory').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.couponData = resp['result']
        this.pageCount = resp['count'];
        this.loader = false;


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
          if (this.couponData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }

    })
  }



  showItems(data){
    console.log(data);
    const dialogRef = this.dialogs.open(UpdateKycComponent, {
      width: '600px',
      panelClass:'cs-modal',
      data:{
        itemData: data,
        from_Item: 'purchase-item'
      }

    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }
  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }




  update(id): void {
    const dialogRef = this.dialog.open(UpdateKycComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'kyc_id': id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.InfluencerDetail();
      }
    });
  }


  pie_chart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: ['Scan', 'Referral Incentive', 'Redeem'],
        datasets: [{
          label: '#',
          data: [this.wallet_Detail.scan_sum, this.wallet_Detail.referral_sum, this.wallet_Detail.redeem_sum],
          backgroundColor: [
            'rgba(131, 183, 53, 0.9)',
            'rgba(73, 212, 224, 0.9)',
            'rgba(255, 0, 0, 0.9)',
          ]
        }]
      }
    });
  }



  openDialog(type): void {
    const dialogRef = this.dialog.open(AdvanceAddGiftComponent, {
      width: '400px',
      panelClass: 'cs-modal',
      data: {
        'id': this.Influencer_Detail.id,
        'name': this.Influencer_Detail.name,
        'type': type,
        'userType':this.Influencer_Detail.influencer_type
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true || result == undefined) {
        if (type == 'advance_gift') {
          this.getGift();
        }
        else {
          this.getLedger();
        }
      }
    });
  }

  changeStatusDialog(id, status, type, referred_by, Name, influencer_type, scanning_rights, welcome_bonus_flag,distributor_id,dealer_id,influence_status): void {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        order_status: status,
        id: id,
        delivery_from: type,
        referred_by_id: referred_by,
        name: Name,
        influencer_type: influencer_type,
        scanning_rights: scanning_rights,
        welcome_bonus_flag: welcome_bonus_flag,
        distributor_id:distributor_id,
        dealer_id:dealer_id,
        influence_status:influence_status

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.InfluencerDetail();
      }
    });
  }

  back(): void {
    this.location.back()
  }
}
