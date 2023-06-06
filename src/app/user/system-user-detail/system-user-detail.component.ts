import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogService } from 'src/app/dialog.service';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-system-user-detail',
  templateUrl: './system-user-detail.component.html',
  animations: [slideToTop()]
})
export class SystemUserDetailComponent implements OnInit {

  detail:any={};
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  area_list:any=[];
  pinCode_list:any=[];
  active=false;
  user_id;
  input_type:any="";
  visible=true;

  constructor(public alert:DialogComponent, public serve:DatabaseService,public rout:Router,public route:ActivatedRoute,public dialog: MatDialog,public editdialog:DialogService) {
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.user_id = params.id;
      console.log(this.user_id);
      
      });
      this.userDetail(); 
      this.getStateList();
    
    this.getStateList();
   }

  ngOnInit() {
    this.input_type='password';
   
  }

  userDetail()
  {
    // console.log(id);
    let value={"id":this.user_id}
    this.serve.post_rqst(value,"User/user_detail").subscribe((result)=>{
      console.log(result);
      this.detail=result['user_detail']['data'];
    })
  }

  toggleterritory(key,action)
  {
    console.log(action);
    console.log(key);
    
    if(action == 'open')
    { this.active[key] = true; }
    if(action == 'close')
    { this.active[key] = false;}
    console.log(this.active);
  }

  updateDetail()
  {
    console.log(this.detail);
    
    console.log("systemuserupdate");
    let value={'id':this.detail.id,'data':this.detail};
    this.serve.post_rqst(value,"User/update_user").subscribe((result=>{
      console.log(result);
      if(result)
      {
        this.rout.navigate(['/sale-user-list']);
      }
      
    }))
    
  }
  getStateList()
  {
    console.log("addUser");
    this.serve.post_rqst(0,"User/state_user_list").subscribe((response=>{
      console.log(response);  
      this.state_list=response['query']['state_name'];
      console.log(this.state_list);
    }));
    
  }
    getDistrict()
    {
      console.log(this.detail.state_name);
      this.serve.post_rqst(this.detail.state_name,"User/district_user_list").subscribe((response=>{
        // console.log(response);
        this.district_list=response['query']['district_name'];
        console.log(this.district_list);
        
      }));
        
    }

    getCityList()
    {
      console.log(this.detail.district_name);
      
      console.log(this.detail.state_name);
      let value={"state":this.detail.state_name,"district":this.detail.district_name}
      this.serve.post_rqst(value,"User/city_user_list").subscribe((response=>{
        console.log(response);
        this.city_list=response['query']['city'];
        console.log(this.city_list);
        
      }));
    }

   getAreaList()
   {
    console.log(this.detail.district);
    let value={"state":this.detail.state_name,"district":this.detail.district_name,"city":this.detail.city}
    this.serve.post_rqst(value,"User/area_user_list").subscribe((response=>{
      console.log(response);
      this.area_list=response['query']['area'];
      console.log(this.area_list);
      
    }));
   }
   
   getPinCodeList()
    {
      console.log(this.detail.state_name,this.detail.district_name,this.detail.city,this.detail.area);
      let value={"state":this.detail.state_name,"district":this.detail.district_name,"city":this.detail.city,"area":this.detail.area}
      this.serve.post_rqst(value,"User/pincode_user_list").subscribe((response=>{
        console.log(response);
        this.pinCode_list=response['query']['pincode'];
        console.log(this.pinCode_list);
        
      }));
    }
    category="user";
 

   
    show_password()
    {
      this.input_type = 'text';
      this.visible=false;
    }
  
    hide_password()
    {
      this.input_type = 'password';
      this.visible=true;
    }

}
