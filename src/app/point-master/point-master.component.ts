import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
@Component({
  selector: 'app-point-master',
  templateUrl: './point-master.component.html'
})
export class PointMasterComponent implements OnInit {
  data:any ={};
  savingFlag: boolean = false;
  userData: any;
  userId: any;
  userName: any;
  
  constructor(public service:DatabaseService, public rout: Router, public toast:ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.pointCategory_data();
  }
  
  
  ngOnInit() {
  }
  
  
  
  pointCategory_data(){
    this.service.post_rqst({},'Master/pointMasterDetail').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.data.welcome_point =  resp['point_master_detail']['welcome_point'];
        this.data.id = resp['point_master_detail']['id'];
        this.data.anniversary_point =  resp['point_master_detail']['anniversary_point'];
        this.data.birthday_point =  resp['point_master_detail']['birthday_point'];
        this.data.registration_refferal =  resp['point_master_detail']['registration_refferal'];
        this.data.transaction_incentive =  resp['point_master_detail']['transaction_incentive'];
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  submitDetail(){
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    this.savingFlag = true;
    this.service.post_rqst(this.data,'Master/pointMasterAdd').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    })
    
  }}
  