import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-banner-add',
  templateUrl: './banner-add.component.html'
})
export class BannerAddComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput: any;
  data:any={};
  selected_image :any;
  image_id:any;
  image = new FormData();
  savingFlag: boolean=false;
  errorMsg: boolean=false;
  userData: any;
  userId: any;
  userName:any;
  
  
  constructor(public service:DatabaseService,public route:ActivatedRoute, public router : Router, public toast:ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
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
  
  submitDetail(){
    if(!this.selected_image){
      this.toast.errorToastr('Banner images required');
      return;
    }
    
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    this.data.banner   = this.selected_image;
    
    
    this.service.post_rqst(this.data,'Master/addBanner').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/banner-list']);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    })
    
  }
  
  
}
