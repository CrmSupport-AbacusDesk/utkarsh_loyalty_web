import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html'
})
export class ContactUsComponent implements OnInit {
  data:any ={};
  savingFlag:boolean=false;
  userData: any;
  userId: any;
  userName:any;
  assign_login_data:any;
  logined_user_data:any;
  contact_id:any;
  
  
  constructor( public service: DatabaseService, public rout: Router, public toast:ToastrManager, public session: sessionStorage) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }
  
  ngOnInit() {
    this.contactDetail();
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  contactDetail(){
    // this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    this.service.post_rqst({},'Master/contactDetail').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.data.contact_number = resp['contact_detail']['contact_number'];
        this.data.id = resp['contact_detail']['id'];
        this.data.contact_number_2 = resp['contact_detail']['contact_number_2'];
        this.data.email = resp['contact_detail']['email'];
        this.data.url = resp['contact_detail']['url'];
        this.data.address = resp['contact_detail']['address'];
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
    
  }
  
  submitDetail(){
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    
    this.service.post_rqst(this.data,'Master/addContact').subscribe((resp)=>
    {
      
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.contact_id = resp['last_id'];
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    })
    
  }
  
  
}
