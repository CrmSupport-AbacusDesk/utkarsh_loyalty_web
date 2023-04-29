import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-pdf-catalouge',
  templateUrl: './pdf-catalouge.component.html'
})
export class PdfCatalougeComponent implements OnInit {
  fabBtnValue:any= 'add'
  skLoading:boolean = false;
  pdfCatalouge_data:any=[];
  loader:boolean = false;
  document:any =[];
  url:any;
  pageCount:any;
  total_page:any;
  pagenumber:any=1;
  logined_user_data:any={};
  assign_login_data:any={};
  page_limit:any;
  start:any=0;
  count:any;
  filter: {};
  sr_no: number;
  
  constructor(public service:DatabaseService, public toast: ToastrManager, public dialog:DialogComponent,public session: sessionStorage) 
  {
    this.page_limit = this.service.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.url = service.uploadUrl + 'doc_catalogue/';
    this.getPdfList(); 
  }
  
  
  ngOnInit() {
  }
  pervious(){
    this.start = this.start - this.page_limit;
    this.getPdfList();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.getPdfList();
  }
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }
  
  getPdfList() {
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    
    this.service.post_rqst({'start':this.start,'pagelimit':this.page_limit}, "Master/documentCatalogueList").subscribe((result => {
      if(result['statusCode'] == 200){
        this.document = result['doc_list']
        this.pageCount = result['count'];
        
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
      }
    }
    
    
    ));
    
  }
  
  refresh(){
    this.filter = {};
    this.getPdfList();
  }
  
  delete(id){
    this.dialog.delete('PDF Catalogue!').then((result) => {
      if (result) {
        this.service.post_rqst({'doc_id':id}, "Master/deleteDoc").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.getPdfList()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });
    
    
  }
  
}
