import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { _localeFactory } from '@angular/core/src/application_module';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  animations: [slideToTop()]

})
export class AddLeadComponent implements OnInit {

  data: any = {};
  savingFlag: boolean = false;
  status = '';
  today_date: any;
  userData: any;
  userId: any;
  userName: any;
  networkType: any = [];
  city_area_list: any = [];
  loader: boolean;
  states: any = [];
  district_list: any = [];


  constructor(public serve: DatabaseService, public router: Router, public location: Location, public rout: Router, public session: sessionStorage, public dialog: DialogComponent, public ActivatedRoute: ActivatedRoute, public toast: ToastrManager) {
    this.today_date = new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.getStateList();
    this.getNetworkType();
    this.getsource_list();
  }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      this.today_date = new Date().toISOString().slice(0, 10);
      this.data.dr_type = params.id;
    });

  }





  selectLeadType(dr_type) {
    let Index = this.networkType.findIndex(row => row.type == dr_type)
    if (Index != -1) {
      this.data.type_name = this.networkType[Index].module_name
      this.data.type = this.networkType[Index].type
    } else {
    }

  }

  getStateList() {
    this.serve.post_rqst(0, "CustomerNetwork/getAllState").subscribe((response => {
      if (response['statusCode'] == 200) {

        this.states = response['all_state'];
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }
    }));
  }

  //submit function
  submitDetail() {
    this.data.date_of_anniversary = moment(this.data.date_of_anniversary).format('YYYY-MM-DD');
    this.data.date_of_birth = moment(this.data.date_of_birth).format('YYYY-MM-DD');
    this.data.uid = this.userId;
    this.data.uname = this.userName;

    this.data.status = this.status
    this.savingFlag = true;
    this.serve.post_rqst({ 'data': this.data }, "Enquiry/addEnquiry").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.rout.navigate(['/lead-list/']);
        setTimeout(() => {
          this.loader = false;
          this.savingFlag = false;
          this.router.navigate(['/lead-list']);
        }, 700);
      }

      else {
        this.dialog.error(result['statusMsg']);
      }
    }, error => {
    })
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }



  getNetworkType() {
    this.serve.post_rqst('', "Enquiry/leadNetworkModule").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.networkType = result['modules'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  source_list: any = [];
  getsource_list() {
    this.serve.post_rqst('', "Enquiry/enquirySourceList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.source_list = result['lead_source_list'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }

    }))
  }
  getDistrict(val) {
    let st_name;
    if (val == 1) {
      st_name = this.data.state;
    }
    this.serve.post_rqst({ 'state_name': st_name }, "CustomerNetwork/getAllDistrict").subscribe((response => {
      if (response['statusCode'] == 200) {

        this.district_list = response['all_district'];
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }
    }));
  }
  getArea(val) {
    let dist_name;
    if (val == 1) {
        dist_name = this.data.district;
    }
    let value = { "state": this.data.state, "district": dist_name }
    this.serve.post_rqst(value, "CustomerNetwork/getAreaData").subscribe((response => {
        if(response['statusCode'] == 200){
            this.city_area_list = response['area'];
        }else{
            this.toast.errorToastr(response['statusMsg']);
        }
        
    }));
}


  back(): void {
    this.location.back()
  }
}
