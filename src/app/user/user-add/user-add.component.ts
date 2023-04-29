import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import {  sessionStorage} from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { DesignationComponent } from '../designation/designation.component';


@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  animations: [slideToTop()]
  
})
export class UserAddComponent implements OnInit {
  states: any = [];
  report_manager:any =[];
  data: any = {};
  district_list: any = [];
  user_type;
  sales_type: any = [];
  loader: boolean = false;
  module_name: any = [];
  exist:boolean=false;
  assign_module_data:any=[];
  userData: any;
  userId: any;
  userName: any;
  savingFlag:boolean = false;
  assign_login_data:any={};
  logined_user_data:any={};
  maxDate:any;
  brandList:any =[];
  
  constructor(public serve: DatabaseService, 
    public dialog1: MatDialog,
    private route: ActivatedRoute,
    public toast:ToastrManager, public location: Location, public session: sessionStorage, public rout: Router,public dialog: DialogComponent) {
      this.maxDate = new Date();
      this.getBrand();
      this.getStateList();
      this.get_module_data();
      this.data.user_type = 'Sales User';
      this.getReportManager('');
      this.get_sales_user_type(this.data.user_type, '');
      this.assign_login_data = this.session.getSession();
      this.logined_user_data = this.assign_login_data.value.data;
    }
    
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.userId = params['id'];
        if (this.userId)
        {
          this.loader = true;
        }
      });
    }
    
   
    
    MobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
      
    }
    
    


       
    getBrand() {
      this.serve.post_rqst({}, "Master/brandList").subscribe((result => {
        if(result['statusCode'] ==  200){
          this.brandList = result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }

    check_number() {
      if (this.data.mobileno.length == 10) {
        this.serve.post_rqst({ "mobile": this.data.mobileno }, "Master/userMobileNoCheck").subscribe((result => {
          if (result['statusCode'] == 200) {
            if(result['statusMsg'] != 'Not Exist'){
              this.exist = true;
              this.toast.errorToastr(result['statusMsg'])
            }
            else{
              this.exist = false;
            }
          }
          else {
            this.exist = false;
            this.toast.errorToastr(result['statusMsg'])
          }
        }))
      }
    }
    
    
    getStateList() {
      this.serve.post_rqst(0, "Master/getAllState").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.states = result['all_state'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }
    
    getDistrict(val) {
      let st_name;
      if(val == 1)
      {
        st_name = this.data.state;
      }
      this.serve.post_rqst({'state_name':st_name}, "Master/getAllDistrict").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.district_list = result['all_district'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
      
    }

    
    
    get_sales_user_type(type, event) {
      let Usertype
      if(type != ''){
        Usertype = type;
      }
      else{
        Usertype = event.value
      }
      this.serve.post_rqst({'user_type':Usertype}, "Master/getDesignation").subscribe((response => {
        this.sales_type = response['all_designation'];
      }));
    }
    
    getReportManager(searcValue) {
      setTimeout(() => {
        this.serve.post_rqst({'search':searcValue}, "Master/getSalesUserForReporting").subscribe((result => {
          if(result['all_sales_user']['statusCode'] ==  200){
            this.report_manager = result['all_sales_user']['all_sales_user'];
          }
          else{
            this.toast.errorToastr(result['all_sales_user']['statusMsg'])
          }
        }));
      }, 500);
    }
    
    
    submitDetail() {
      this.loader = true;
      if(this.data.date_of_joining){
        this.data.date_of_joining = moment(this.data.date_of_joining).format('YYYY-MM-DD');
        this.data.date_of_joining=this.data.date_of_joining;
      }
      if (this.data.user_type == 'System User'){
        this.data.assignModule= this.assign_module_data;
      }
      if(this.data.user_role){
        let index= this.sales_type.findIndex(d=> d.id==this.data.user_role);
        if(index!=-1){
          this.data.role_name= this.sales_type[index].role_name
        }
        console.log(this.data.role_name);
      }


      this.data.uid=this.userId;
      this.data.uname=this.userName;
      this.data.created_by_name=this.logined_user_data.name;
      this.data.created_by_id=this.logined_user_data.id;
      this.savingFlag = true;
      this.serve.post_rqst({'data':this.data}, "Master/addUser").subscribe((response => {
        if(response['statusCode']=="200"){
          this.toast.successToastr(response['statusMsg']);
          this.rout.navigate(['/sale-user-list']);
          this.savingFlag = false;
          this.serve.count_list();

        }
        else{
          this.toast.errorToastr(response['statusMsg']);
          this.savingFlag = false;
        }
      }));
    }
    
    get_module_data() {
      this.serve.post_rqst(0, "Master/moduleMasterList").subscribe((response => {
        this.assign_module_data = response['result'];
      }));
      
    }
    
    assign_module(module_name, event , index) {
      if (event.checked) {
        this.assign_module_data[index][module_name] = 'true';
      }
      else {
        this.assign_module_data[index][module_name] = 'false';
      }
    }
    
    
    back(): void {
      this.location.back()
    }
    
    openDialog(): void {  
      const dialogRef = this.dialog1.open(DesignationComponent, {
        width: '500px',
        panelClass:'cs-modal',
        data:{
          'type':'designation'
        }
        
      });
      
      dialogRef.afterClosed().subscribe(result => {
        
        if(result == true){
          this.get_sales_user_type(this.data.user_type, '')
        }
        
      });
    }
  }
  