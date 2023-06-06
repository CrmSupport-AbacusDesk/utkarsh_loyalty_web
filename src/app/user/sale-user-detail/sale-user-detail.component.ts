import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import {MatDialog} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/dialog.service';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';

import * as moment from 'moment';
import { Location } from '@angular/common';
// import { DH_CHECK_P_NOT_PRIME } from 'constants';
// import { ToastrManager } from 'ng6-toastr-notifications';
import { DesignationComponent } from '../designation/designation.component';

@Component({
  selector: 'app-sale-user-detail',
  templateUrl: './sale-user-detail.component.html',
  animations: [slideToTop()]
})
export class SaleUserDetailComponent implements OnInit {
  detail:any={};
  skLoading:boolean = false;
  manager:any;
  user_id;
  loader:any;
  login_data:any=[];
  assign_module_data:any=[];
  checkin_data:any=[];
  userData: any;
  userId: any;
  userName: any;
  
  
  constructor(public alert:DialogComponent, private router: Router, public location: Location,public  service:DatabaseService, public dialog: MatDialog,public rout:Router,public editdialog:DialogService,
    public session: sessionStorage,public route:ActivatedRoute) {
      this.route.params.subscribe( params => {
        this.user_id = params.id;
        this.service.currentUserID = params.id
        this.login_data = this.session.getSession();
        this.login_data = this.login_data.value;
        this.login_data = this.login_data.data;
        this.userData = JSON.parse(localStorage.getItem('st_user'));
        this.userId=this.userData['data']['id'];
        this.userName=this.userData['data']['name'];
      });
      this.userDetail(); 
    }
    
    ngOnInit() {}
    
    
    back(): void {
      this.location.back()
    }
    
    userDetail()
    {
      this.skLoading = true;
      this.service.post_rqst({'id':this.user_id},"Master/salesUserDetail").subscribe((result)=>{
        this.detail=result['sales_detail'];
        this.skLoading = false;
        if( this.detail.user_type == 'System User'){
          this.assign_module_data=this.detail.assign_module;
        }
      })
      
    }
    
    
    assign_module(module_name, event , index)
    {
      if (event.checked) {
        this.assign_module_data[index][module_name] = 'true';
        this.assign_module_data[index]['view'] = 'true';
      }
      else {
        this.assign_module_data[index][module_name] = 'false';
      }
      this.service.post_rqst(this.assign_module_data[index],"user/update_user_module").subscribe(response=>
        {
          this.userDetail();
        });
      }
      
      
   


      openDialog(type){  
        const dialogRef = this.dialog.open(DesignationComponent, {
          width: '750px',
          panelClass:'cs-modal',
          data:{
            'type':type,
            'user_detail':this.detail
          }
          
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if(result == true){
            this.userDetail();
          }
        });
      }
      
    }
    
    