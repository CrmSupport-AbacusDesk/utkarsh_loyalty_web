import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router,ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';  


@Component({
  selector: 'app-pdf-catalogue-add',
  templateUrl: './pdf-catalogue-add.component.html'
})
export class PdfCatalogueAddComponent implements OnInit {
  data:any ={};
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName: any;
  urls: any = [];
  imageError:any='';
  typecheck:any='';
  istrue:boolean=false;
  selectedFile: any = [];
  file:any = {};
  file_name:any;
  formData = new FormData();
  
  constructor(public serve:DatabaseService,public route:ActivatedRoute, public router : Router, public toast:ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
  }
  
  ngOnInit() {
  }
  
  onUploadChange1(evt: any,f) 
  {
    this.imageError = null;
    this.file = evt.target.files[0];
    this.file_name = this.file.name;
    const allowed_types = ['application/pdf'];
    this.typecheck = !_.includes("application/pdf", this.file.type)
    if (!_.includes(allowed_types,this.file.type)) {
      this.toast.errorToastr('Only Pdf File Accepted');
      this.file_name = ''
      this.istrue = false;
      return
    }
    let byte = 1000000    // equal to 1mb
    
    if(this.file.size > (byte*20)){
      this.toast.errorToastr('PDF file size is too large, maximum file size is 20 MB.');
      this.file_name = ''
      this.istrue = false;
      return
    }
    else{  this.istrue = true;}
  }
  
  delete_img(index: any) {
    this.urls.splice(index, 1)
    this.selectedFile=[];
  }
  
  
  
  submitDetail() {
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    
    this.savingFlag = true;
    this.serve.post_rqst(this.data,'Master/addDocumentCatalogue').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        if (this.formData) {
          this.formData.append('category', this.file, this.file.name);
          this.formData.append('id', resp['last_id']);
          this.serve.FileData((this.formData), "Master/insertDocumentCatalogueDocFile").subscribe((resp) => {
            this.savingFlag = false;
            if (resp['statusCode'] == 200) {
              this.toast.successToastr(resp['statusMsg']);
              this.savingFlag = false;
              this.router.navigate(['/catalogue']);
            }
            else{
              this.toast.errorToastr(resp['statusMsg']);
              this.savingFlag = false;
            }
          });
        }
        
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      
    })
  }
  
}
