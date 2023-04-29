import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { sessionStorage } from '../localstorage.service';



@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html'
})
export class AboutUsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  savingFlag:boolean =false;
  data:any ={};
  assign_login_data:any={};
  logined_user_data:any={};
  url:any;
  img_id:any
  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
      ["fontName", "fontSize", "color"],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
      
    ]
  };
  
  
  constructor(public service:DatabaseService, public session: sessionStorage, public toast:ToastrManager, private router: Router, private route: ActivatedRoute) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.url = this.service.uploadUrl + 'about/';
  }
  
  ngOnInit() {
    this.profileDetail();
  }
  
  profileDetail(){
    // this.savingFlag = true;
    this.service.post_rqst({},'Master/aboutDetail').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.data.about_us = resp['about_detail']['about_us'];
        this.data.profile_img = resp['about_detail']['profile_img'];
        this.data.id = resp['about_detail']['id'];
        this.img_id = this.data.id;
      }
      
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
    
  }
  
  
  onUploadChange1(evt: any) {
    const file = evt.target.files[0];
    if (file) {
      this.img_id = '';
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded1.bind(this);
      reader.readAsBinaryString(file);
    }
    else{
      this.img_id = this.data.id;
    }
  }
  
  handleReaderLoaded1(e) {
    this.data.profile_img = 'data:image/png;base64,' + btoa(e.target.result);
  }
  
  submitDetail() {
    this.data.created_by_id=this.logined_user_data.id;
    this.data.created_by_name=this.logined_user_data.name;
    this.savingFlag = true;
    this.service.post_rqst( this.data, 'Master/companyProfile')
    .subscribe( resp => {
      this.savingFlag = false;
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    });
  }
  
}
