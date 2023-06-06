import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html'
})
export class DesignationComponent implements OnInit {

  savingFlag: boolean = false;
  data: any = {};
  assign_login_data: any = {};
  logined_user_data: any = {};
  users: any = [];
  allAssignChannelPartner: any = [];
  allAssignChannelPartner2: any = [];
  tempSearch: any = '';
  showChannelPartner:boolean=false;
  constructor(public toast: ToastrManager, @Inject(MAT_DIALOG_DATA) public modelData, public rout: Router, public session: sessionStorage, public service: DatabaseService, public dialogRef: MatDialogRef<DesignationComponent>) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;

    if (modelData.type == 'transferData') {
      this.getReportManager('');
      this.data.user_id = modelData.user_detail.id;
      this.data.name = modelData.user_detail.name + ' ' + modelData.user_detail.employee_id;
      this.data.employee_id = modelData.user_detail.employee_id;
    }
    if (modelData.type == 'updatePassword') {
      this.data.user_id = modelData.user_detail.id;
      this.data.password = modelData.user_detail.password;
      this.data.username = modelData.user_detail.username;
    }
    if (modelData.type == 'edit_designation') {
      this.data.id = modelData.data.id;
      this.data.user_type = modelData.data.user_type;
      this.data.designation = modelData.data.role_name;
    }
    console.log(modelData);

  }

  ngOnInit() {
  }



  getReportManager(searcValue) {
    this.service.post_rqst({ 'search': searcValue }, "Master/getSalesUserForReporting").subscribe((result => {
      if (result['all_sales_user']['statusCode'] == 200) {
        this.users = result['all_sales_user']['all_sales_user'];
      }
      else {
        this.toast.errorToastr(result['all_sales_user']['statusMsg'])
      }
    }));
  }
  getAssignedChannelPartner() {
    let index = this.data.transfer_module.findIndex(r => r == 'Customer');
    if(index!=-1){
      this.showChannelPartner=true;
    }else{
      this.showChannelPartner=false;

    }
    this.service.post_rqst({ 'user_id': this.data.user_id }, "Master/getDistributorData").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.allAssignChannelPartner = result['result'];
        this.allAssignChannelPartner2 = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  searchChannelPartner(channelPartner) {
    console.log(channelPartner);
    channelPartner = channelPartner.toLowerCase();
    this.tempSearch = '';
    this.allAssignChannelPartner = [];
    for (let x = 0; x < this.allAssignChannelPartner2.length; x++) {
      this.tempSearch = this.allAssignChannelPartner2[x].company_name.toLowerCase();

      if (this.tempSearch.includes(channelPartner)) {
        this.allAssignChannelPartner.push(this.allAssignChannelPartner2[x])
      }
    }
  }

  selectAll2(action) {
    if (action == 'allChannelPartners') {
      setTimeout(() => {
        if (this.data.allChannelPartners == true) {
          const productData = [];
          for (let i = 0; i < this.allAssignChannelPartner.length; i++) {
            productData.push(this.allAssignChannelPartner[i].id)
          }
          this.data.channel_partner_id = productData;
        } else {
          this.data.channel_partner_id = [];
        }
      }, 500);
    }
  }


  submitDetail(type) {
    this.savingFlag = true;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.created_by_id = this.logined_user_data.id;
    let header
    if (type == 'designation') {
      header = this.service.post_rqst({ 'data': this.data }, "Master/addDesignation")
    }
    if (type == 'edit_designation') {
      header = this.service.post_rqst({ 'data': this.data }, "Master/editDesignation")
    }
    if (type == 'transfer-data') {
      header = this.service.post_rqst({ 'data': this.data }, "Master/userDataTransfer")
    }
    if (type == 'update-password') {
      header = this.service.post_rqst({ 'data': this.data }, "Master/updateUserPassword")
    }
    header.subscribe((response) => {
      if (response['statusCode'] == 200) {
        this.toast.successToastr(response['statusMsg']);
        // this.rout.navigate(['/user-add']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(response['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
      this.savingFlag = false;
    });
  }

}
