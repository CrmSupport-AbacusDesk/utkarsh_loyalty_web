import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-point-category-add',
  templateUrl: './point-category-add.component.html'
})
export class PointCategoryAddComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  point_category_id:any;
  data:any ={};
  savingFlag:boolean = false;
  
  constructor(public service:DatabaseService, public rout: Router, public toast:ToastrManager, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.point_category_id = params['id'];
      if (this.point_category_id)
      {
        this.pointCategory_data();
      }
    });
  }
  
  pointCategory_data(){
    this.service.post_rqst({'id':this.point_category_id},'Master/pointCategoryMasterDetail').subscribe((resp)=>
    {
      this.data =  resp['point_category_detail'];
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
    
    let header;
    if(this.point_category_id){
      
      if(this.data.point_type == 'Master Box'){
        this.data.influencer_point = '';
        this.data.scanning_point = '';
      }
      else{
        this.data.master_point = '';
      }
      
      header = this.service.post_rqst(this.data,'Master/editPointCategory')
    }
    else{
      header = this.service.post_rqst(this.data,'Master/addPointCategory')
    }
    header.subscribe((resp)=>
    {
      
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/point-list']);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      
    }, error => {
    })
    
  }
  
  
}
