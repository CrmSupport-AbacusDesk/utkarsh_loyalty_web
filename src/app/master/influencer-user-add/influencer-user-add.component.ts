import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-influencer-user-add',
  templateUrl: './influencer-user-add.component.html'
})

export class InfluencerUserAddComponent implements OnInit {
  data:any ={};
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName:any;
  exist_id:any;
  
  constructor(public service:DatabaseService, public rout: Router, public toast:ToastrManager, private router: Router, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.exist_id = params['id'];
      if(this.exist_id){
        this.getDetail();
      }
    });
  }
  
  getDetail(){
    this.service.post_rqst({'id':this.exist_id},'Master/influencerMasterDetail').subscribe((resp)=>
    {

      if(resp['statusCode'] == 200){
        this.data = resp['result'];

        if( this.data.scanning_rights == 'Yes'){
          this.data.point_transfer_right = '';
        }
      }
      else{
        this.toast.errorToastr(resp['statusMsg'])
      }
    })
    
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  
  submitDetail(){
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    let header
    if(this.exist_id){
      this.data.exist_id = this.exist_id;
      header = this.service.post_rqst(this.data,'Master/influencerMasterSave')
    }
    else{
      header = this.service.post_rqst(this.data,'Master/influencerMasterSave')
    }
    
    header.subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/influencer-user-list']);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      
    })
    
  }
  
  
  
}
