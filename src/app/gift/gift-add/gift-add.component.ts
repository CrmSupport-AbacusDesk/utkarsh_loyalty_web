import { Component, OnInit } from '@angular/core';

import { DatabaseService } from 'src/_services/DatabaseService';
import {ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-gift-add',
  templateUrl: './gift-add.component.html'
})
export class GiftAddComponent implements OnInit {

  userData: any;
  userId: any;
  userName: any;
  data:any ={};
  errorMsg: boolean;
  loader:any=false;
  selected_image :any;
  image_id:any;
  image = new FormData();
  savingFlag: boolean=false;
  today_date: Date;

  constructor(public service:DatabaseService, public router : Router, private route: ActivatedRoute, public toast:ToastrManager) {
    this.data.gift_type = 'Gift'
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.today_date = new Date();


  }

  ngOnInit() {

  }

  onUploadChange(data: any)
  {
    this.errorMsg = false;
    this.image_id ='';
    for(let i=0;i<data.target.files.length;i++)
    {
      let files = data.target.files[i];
      if (files)
      {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_image = e.target.result
        }
        reader.readAsDataURL(files);
      }
      this.image.append(""+i,data.target.files[i],data.target.files[i].name);
    }
  }


  resetValue(){
    this.data.range_end = '';
  }

  submitDetail(){

    if(this.data.gift_type == 'Cash'){
      if(parseInt(this.data.range_end) <= parseInt(this.data.range_start) ){
        this.toast.errorToastr('The range end value should be greater than the range start value');
        return;
      }
    }
    if(this.data.gift_type == 'Gift'){
      if(this.selected_image==undefined){
        this.toast.errorToastr('Please Upload Image');
        return;
      }
    }

    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    this.data.gift_img = this.selected_image;
    let header = this.service.post_rqst(this.data,'GiftGallery/addGiftGallery')
    header.subscribe((resp)=>
    {
      if (resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/gift-list']);
        this.service.count_list();

      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }

    }, error => {
      this.toast.errorToastr(error);
    })

  }

}


