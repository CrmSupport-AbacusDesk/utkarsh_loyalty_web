import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { sessionStorage } from '../localstorage.service';
import { animationFrameScheduler } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  count:any=[];
  distactive: boolean=false;
  ordersactive: boolean=false;
  masteractive: boolean=false;
  reportactive: boolean=false;
  leadactive: boolean=false;
  targetactive:boolean=false;
  accountactive:boolean=false;
  login_data:any={};
  networkType :any = [];
  networkType1 :any = [];

  constructor(public session: sessionStorage, public route: ActivatedRoute, public serve:DatabaseService,public dialog: MatDialog ,private renderer: Renderer2) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.serve.count_list();
    this.serve.dr_list();
    this.serve.influencer_netwrk();
  }
  ngOnInit() {
  }

  getNetworkType(){
    this.serve.post_rqst('', "CustomerNetwork/distributionNetworkModule").subscribe((result => {
      this.networkType = result['modules'];
    }))
  }
  getNetworkType1(){
    this.serve.post_rqst('', "Dashboard/leadNetworkModule").subscribe((result => {
      this.networkType1 = result['modules'];
    }))
  }

  status:boolean = false;
  clearFilter(){ 
    let blank_data = {}
    this.serve.setData(blank_data)
    console.log('in Clear Filter')
    this.serve.currentUserID = ''
  }
  toggleDropdown(value){
    if(value==1)
    {

      if(this.distactive==false){
        this.distactive=true;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.accountactive=false

      }else{
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.reportactive=false;
        this.accountactive=false

      }

    }
    else if(value==4)
    {

      if(this.leadactive==false){
        this.leadactive=true;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.accountactive=false


      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.accountactive=false

      }

      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==2)
    {
      if(this.ordersactive==false){
        this.distactive=false;
        this.ordersactive=true;
        this.leadactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.accountactive=false


      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.accountactive=false

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==3)
    {
      if(this.masteractive==false){
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=true;
        this.reportactive=false;
        this.accountactive=false

      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.accountactive=false

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==9)
    {
      if(this.targetactive==false){
        this.distactive=false;
        this.ordersactive=false;
        this.accountactive=false

        this.leadactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.targetactive=true;

      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.targetactive=false;
        this.accountactive=false


      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==6)
    {
      if(this.accountactive==false){
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.targetactive=false;
        this.accountactive=true;
      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.reportactive=false;
        this.targetactive=false;
        this.accountactive=false;
      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==7)
    {
      if(this.reportactive==false){
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=false;
        this.accountactive=false;
        this.targetactive=false;
        this.reportactive=true;
      }else{
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.targetactive=false;
        this.reportactive=false;
        this.accountactive=false;
      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else if(value==0)
    {

      this.distactive=false;
      this.ordersactive=false;
      this.leadactive=false;
      this.targetactive=false;
      this.reportactive=false;
      this.masteractive=false;
      this.accountactive=false
    }
    // this.renderer.removeClass(event.target, 'active');
    // this.renderer.removeClass(document.body, 'active');

    else if(value==5)
    {
      if(this.reportactive==false){
        this.reportactive=true;
        this.distactive=false;
        this.ordersactive=false;
        this.leadactive=false;
        this.masteractive=false;
        this.accountactive=false

      }else{
        this.reportactive=false;
        this.leadactive=false;
        this.ordersactive=false;
        this.distactive=false;
        this.masteractive=false;
        this.accountactive=false

      }
      // this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
    else{
      this.distactive=false;
      this.ordersactive=false;
      this.masteractive=false;
      this.leadactive=false;
      this.reportactive=false;
      this.targetactive=true;
      this.accountactive=false


    }
    // this.status = !this.status;

    // if(this.status) {
    //   this.renderer.addClass(event.target, 'active');
    //   this.renderer.removeClass(document.body, 'active');
    // }
    // else {
    //   this.renderer.removeClass(event.target, 'active');
    //   // this.renderer.removeClass(document.body, 'active');
    // }
  }


  toggleHeader() {
    this.status = !this.status;
    if(!this.status) {
      this.renderer.addClass(document.body, 'nav-active');
    }
    else {
      this.renderer.removeClass(document.body, 'nav-active');
    }
  }

  status1:boolean = false;
  toggleNav() {
    this.status1 = !this.status1;
    if(this.status1) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }
}
