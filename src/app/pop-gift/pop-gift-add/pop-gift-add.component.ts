import { Component, OnInit } from '@angular/core';
import { DialogComponent } from 'src/app/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service'
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-pop-gift-add',
  templateUrl: './pop-gift-add.component.html'
})
export class PopGiftAddComponent implements OnInit {
  savingFlag:boolean = false;
  formData = new FormData();
  data: any = {};
  previous:any ={};
  urls: any = [];
  selectedFile: any = [];
  loader: any;
  id: any;
  logIN_user: any;
  userName:any;
  userId:any;
  img_id:any;
  url:any;
  
  
  constructor(
    public toast: ToastrManager,
    public route: ActivatedRoute,
    public serve: DatabaseService,
    public dialog: DialogComponent,
    public session: sessionStorage,
    public rout: Router) {
      this.url = this.serve.uploadUrl + 'pop_gift/';
      this.route.params.subscribe(params => {
        
        this.id = params.id;
      });
      this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
      
      this.userName=this.logIN_user['data']['name'];
      this.userId=this.logIN_user['data']['id'];
      if (this.id != 0) {
        this.edit_detail();
      }
    }
    
    ngOnInit() {}
    
    edit_detail() {
      this.serve.post_rqst({ "id": this.id }, "/PopGift/popDetail").subscribe((result => {
        this.previous = result['result']['data'];
        this.data = result['result']['data'];
        this.img_id =  this.data['id'];
        this.data.total_amount =  this.data.qty_stock * this.data.rate;
        this.previous.total_amount =  this.previous.qty_stock * this.previous.rate;
        this.urls.push(this.data.pop_image);
      }))
    }
    
    
    insertImage(event) {
      let files = event.target.files;
      this.img_id = '';
      if (files) {
        for (let file of files) {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.urls.push(e.target.result);
          }
          reader.readAsDataURL(file);
        }
      }
      for (var i = 0; i < event.target.files.length; i++) {
        this.selectedFile.push(event.target.files[i]);
      }
    }
    
    delete_img(index: any) {
      this.urls.splice(index, 1)
      this.selectedFile=[];
      
    }
    
    clearValue(){
      this.data.total_amount = '';
      this.data.rate = '';
    }
    
    totalAmount(rate){
      this.data.total_amount =  this.data.qty_stock * rate;
    }
    errorMsg: any;
    add_gift() {
      if (this.id == 0) {
        if (this.selectedFile.length > 0) {
          this.data.created_by_id = this.logIN_user.data.id;
          this.data.created_by_name = this.logIN_user.data.name;
          this.savingFlag = true;
          this.serve.post_rqst(this.data, "PopGift/submitPopGift").subscribe(result => {
            
            if(result['statusCode']==200){
              this.savingFlag = false;
              this.errorMsg = result['statusMsg'];
              
              let id = result['id'];
              for (var i = 0; i < this.selectedFile.length; i++) {
                this.formData.append("image" + i, this.selectedFile[i], this.selectedFile[i].name);
              }
              
              this.formData.append('id', id);
              
              if (this.selectedFile && this.selectedFile.length > 0) {
                this.serve.FileData(this.formData, "PopGift/insertImage").subscribe((resp) => {
                  
                  if(result['statusCode']==200){
                    this.savingFlag = false;                  
                    this.toast.successToastr(resp['statusMsg']);
                    this.rout.navigate(['/pop-gift-list']);
                    
                  }else{
                    this.savingFlag = false;                  
                    this.toast.errorToastr(result['statusMsg']);
                  }
                },err=>{
                  this.savingFlag = false;                  
                  this.toast.errorToastr(result['statusMsg']);
                });
              }
              else {
                this.toast.successToastr("POP Gift", "Added");
                this.rout.navigate(['/pop-gift-list']);
              }
            }else{
              this.savingFlag = false;
              this.toast.errorToastr(result['statusMsg']);
            }
          },err=>{
            this.savingFlag = false;                  
            this.toast.errorToastr('Something went wrong');
          }
          )
        }
        else {
          this.savingFlag = false;
          this.dialog.error("Add Image also");
        }
      }
      else {
        this.savingFlag = true;
        this.data.created_by_id = this.logIN_user.data.id;
        this.data.created_by_name = this.logIN_user.data.name;
        this.data.previous_total_amount  = this.previous.total_amount;
        this.data.previous_qty_stock  = this.previous.qty_stock;
        this.data.previous_rate  = this.previous.rate;
        this.serve.post_rqst(this.data, "PopGift/updatePopGift").subscribe((result => {
          
          if(result['statusCode']==200){
            let id = result['id'];
            this.savingFlag = false;
            for (var i = 0; i < this.selectedFile.length; i++) {
              this.formData.append("image" + i, this.selectedFile[i], this.selectedFile[i].name);
            }
            
            this.formData.append('id', id);
            if (this.selectedFile && this.selectedFile.length > 0) {
              this.loader = true;
              this.savingFlag = true;
              
              this.serve.FileData(this.formData, "PopGift/insertImage").subscribe((resp) => {
                
                if(resp['statusCode']==200){
                  this.savingFlag = false;
                  if (resp) {
                    this.toast.successToastr(resp['statusMsg']);
                    this.rout.navigate(['/pop-gift-list']);
                  }
                }else{
                  this.savingFlag = false;
                  this.toast.errorToastr(resp['statusMsg']);
                }
              });
            }
            else if(this.img_id){
              this.savingFlag = false;
              this.toast.successToastr(result['statusMsg']);
              this.rout.navigate(['/pop-gift-list']);
            }
            else {
              this.savingFlag = false;
              this.toast.errorToastr(result['statusMsg']);
            }
          }
          
          else{
            this.savingFlag = false;
            this.toast.errorToastr(result['statusMsg']);
          }
        }))
      }
    }
    
    back()
    {
      window.history.go(-1);
    }
    
  }
  