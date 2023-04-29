import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-redeem-status-modal',
  templateUrl: './redeem-status-modal.component.html',
  styleUrls: ['./redeem-status-modal.component.scss']
})
export class RedeemStatusModalComponent implements OnInit {
  savingFlag: boolean = false;
  segment: any = {};
  category: any = {};
  login: any = {};
  drlist:any =[]
  delivery_from: any;
  userData: any;
  userId: any;
  userName: any;
  today_date: any;
  assignDrlist:any=[];

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager,public alert : DialogComponent , public dialogRef: MatDialogRef<RedeemStatusModalComponent>) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.today_date = new Date();
    this.segment = this.data.segment;
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.delivery_from = this.data.delivery_from;
    this.getSalesUser('')
    this.distributorList('','');
    this.dealerList('','');

    console.log(this.data)
  }

  ngOnInit() {
    this.login = JSON.parse(localStorage.getItem('login'));
  }
  reason_reject: any
  redeem_status_change(reason, status) {
    this.savingFlag = true;
    this.serve.post_rqst({ 'status': status, 'id': this.data.id, 'reject_reason': reason }, "RedeemRequest/redeemRequestStatusChange").subscribe((result => {

      if (result['statusCode'] == 200){
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }

    }))

  }
  salesUser:any =[];
  getSalesUser(searcValue) {
    this.serve.post_rqst({'search':searcValue}, "influencer/salesUserList").subscribe((response => {

      if (response['statusCode'] == 200) {
        this.salesUser = response['all_sales_user'];
      }
      else {
        this.toast.errorToastr(response['statusMsg']);
      }

    }));
  }
  distributorList(searcValue, state) {
    this.serve.post_rqst({'search':searcValue, 'state':state}, "influencer/distributors_List").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.drlist = result['distributors'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }))
  }


  dealerList(searcValue, state) {
    this.serve.post_rqst({'search':searcValue, 'state':state}, "Influencer/dealer_List").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.assignDrlist = result['dealer'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }))
  }
  influencer_status_change(reason, status) {
    this.savingFlag = true;
    if(status == 'Approved'){
      this.alert.confirm('Are you sure ?').then((result) => {
        if (result) {
          this.serve.post_rqst({ 'status': status, 'influencer_id': Number(this.data.id),'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by':Number(this.userId) ,'distributor_id':this.data.distributor_id,'dealer_id':this.data.dealer_id,'referred_by':this.data.referred_by_id,'name':this.data.name,'influencer_type':this.data.influencer_type}, "Influencer/influencerStatusChange").subscribe((result => {
            if (result['statusCode'] == 200) {
              this.dialog.closeAll();
              this.savingFlag = false;
              this.toast.successToastr('Status Changed Successfully');
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
              this.savingFlag = false;
            }

          }))
        }
      });
    }else{
      this.serve.post_rqst({ 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by':Number(this.userId) ,'reject_reason': reason,'referred_by':this.data.referred_by_id,'name':this.data.name,'influencer_type':this.data.influencer_type}, "Influencer/influencerStatusChange").subscribe((result => {

        if (result['statusCode'] == 200) {
          this.dialog.closeAll();
          this.savingFlag = false;
          this.toast.successToastr('Status Changed Successfully');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;
        }

      }))
    }
  }


  gift_status_change(header) {
    this.serve.post_rqst(header, 'RedeemRequest/redeemRequestGiftStatusChange').subscribe((result => {
      if (result['statusCode'] == 200){
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }))
  }

  updateStatus(status) {
    this.data.estimate_date = moment(this.data.estimate_date).format('YYYY-MM-DD')
    this.data.transfer_date = moment(this.data.transfer_date).format('YYYY-MM-DD')
    this.savingFlag = true;
    let header = {}
    if (status == 'Under Process' || status == 'Received') {
      header = { 'status': status, 'id': this.data.id }
      this.gift_status_change(header)
    } else if (status == 'Shipped') {

      header = { 'status': status, 'id': this.data.id, 'shipping_remark': this.data.Shipped_remark, 'shipping_type': this.data.shipping_type, 'estimate_date': this.data.estimate_date }
      this.gift_status_change(header)
    } else if (status == 'Transferred') {
      header = { 'status': status, 'id': this.data.id, 'payment_mode': this.data.transfer_mode, 'transfer_date': this.data.transfer_date, "transfer_remark": this.data.transfer_remark, 'transaction_no': this.data.transaction_number }
        this.gift_status_change(header)
      // if (this.data.transfer_mode == 'Online') {
      //   header = { 'status': status, 'id': this.data.id, 'payment_mode': this.data.transfer_mode, 'transfer_date': this.data.transfer_date, "transfer_remark": this.data.transfer_remark }
      //   this.gift_status_change(header)
      // } else if (this.data.transfer_mode == 'Online') {

      // }
    }
  }

}
