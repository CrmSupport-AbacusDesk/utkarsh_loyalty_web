import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-userview-target',
  templateUrl: './userview-target.component.html',
  styleUrls: ['./userview-target.component.scss']
})
export class UserviewTargetComponent implements OnInit {
  assign_login_data: any = [];
  assign_login_data2: any = [];
  fabBtnValue:any ='excel';
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  value:any={};
  target_list:any=[];
  active_tab:any='Sale';
  loader:boolean = false;
  datanotfound : boolean = false;
  sr_no:any=0;
  pageCount:any;
  total_page:any; 
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  downurl:any;
  
  
  constructor(public serve: DatabaseService,public alrt:MatDialog,public session: sessionStorage, public toast:ToastrManager) {
    this.page_limit = serve.pageLimit;
    this.downurl = serve.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.get_user_data();
    this.getBrandList()
  }
  
  ngOnInit() {
  }
  
  refresh1()
  {
    this.value={};
    this.get_user_data()
  }
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.get_user_data();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.get_user_data();
  }
  
  brandList:any=[]
  getBrandList() {
    this.serve.post_rqst({}, "target/brandList").subscribe((result => {
      if(result['statusCode'] == 200)
      {
        this.brandList = result['brand_list'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
    
  }
  get_user_data()
  {
    
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    
    if(this.start<0){
      this.start=0;
    }
    
    
    this.loader = true;
    if(this.active_tab=='Sale'){
      this.target_list = []
      this.serve.post_rqst({'user_id':this.assign_login_data2.id, 'start':this.start,'pagelimit':this.page_limit,'search':this.value},"Target/userTargetList").subscribe((result => {
        
        if(result['statusCode'] == 200){
          this.target_list=result['target_list'];
          this.pageCount=result['count'];
          if(this.target_list.length == 0){
            this.datanotfound = true
          }else{
            this.datanotfound= false
          }
          this.loader = false;
          for(let i = 0; i < this.target_list.length; i++){
            this.target_list[i].achieve= parseFloat(this.target_list[i].achieve)
            this.target_list[i].achieve=this.target_list[i].achieve.toFixed(2)
          }
          
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
          
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
        
      }));
    }else
    if(this.active_tab=='Visit'){
      this.target_list = []
      this.serve.post_rqst({'user_id':this.assign_login_data2.id, 'start':this.start,'pagelimit':this.page_limit, 'search':this.value},"Target/userVisitTargetList").subscribe((result => {
        if(result['statusCode'] == 200){
          this.target_list=result['target_list'];
          this.loader = false;
          this.pageCount=result['count'];
          for(let i = 0; i < this.target_list.length; i++){
            this.target_list[i].achieve= parseFloat(this.target_list[i].achieve)
            this.target_list[i].achieve=this.target_list[i].achieve.toFixed(2)
          }

          if(this.target_list.length == 0){
            this.datanotfound = true
          }else{
            this.datanotfound= false
          }
          
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
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }else if(this.active_tab=='Secondary_Sale'){
      this.target_list = []
      this.serve.post_rqst({'user_id':this.assign_login_data2.id, 'start':this.start,'pagelimit':this.page_limit, 'search':this.value},"Target/distributorsSecondaryTargetList").subscribe((result => {
        if(result['statusCode'] == 200){
          this.target_list=result['target_list'];
          this.pageCount=result['count'];
          this.loader = false;
          for(let i = 0; i < this.target_list.length; i++){
            this.target_list[i].achieve= parseFloat(this.target_list[i].achieve)
            this.target_list[i].achieve=this.target_list[i].achieve.toFixed(2)
          }
          if(this.target_list.length == 0){
            this.datanotfound = true
          }else{
            this.datanotfound= false
          }
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
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
  }
  exp_data:any=[];
  excel_data:any=[];
  
  exportAsXLSX():void {
    // Excel/user_visit_target_list
    this.serve.FileData({'search':this.value},"Excel/employee_primary_sale_target_list_for_export").subscribe(resp=>{
      if(resp['msg'] == true){
        window.open(this.downurl + resp['filename'])
        this.get_user_data();
      }else{
      }
      
    })
    
    
  }
  exportAsXLSX1():void {
    this.serve.FileData({'search':this.value},"Excel/user_visit_target_list").subscribe(resp=>{
      if(resp['msg'] == true){
        window.open(this.downurl + resp['filename'])
        this.get_user_data();
      }else{
      }
      
    })
    
    
  }
  exportAsXLSX2():void {
    this.serve.FileData({'search':this.value},"Excel/employee_secondary_sale_target_list_for_export").subscribe(resp=>{
      if(resp['msg'] == true){
        window.open(this.downurl + resp['filename'])
        this.get_user_data();
      }else{
      }
      
    })
    
  }
  upload_excel(type)
  {
    const dialogRef = this.alrt.open(UploadFileModalComponent,{
      width: '500px',
      panelClass:'cs-modal',
      data:{
        'from':'secondary_target',
        'modal_type':type
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.get_user_data()
      }
    });
  }
  
  visit_upload_excel(type)
  {
    const dialogRef = this.alrt.open(UploadFileModalComponent,{
      width: '500px',
      panelClass:'cs-modal',
      data:{
        'from':'user_visit_target',
        'modal_type':type
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.get_user_data()
      }
    });
  }
  
  // upload_excel1()
  // {
  //   const dialogRef = this.alrt.open(UploadFileModalComponent,{
  //     width: '500px',
  //     panelClass:'cs-modal',
  //     data:{
  //       'from':'user_visit_target',
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.get_user_data()
  //   });
  // }
  // upload_excel2()
  // {
  //   const dialogRef = this.alrt.open(UploadFileModalComponent,{
  //     width: '500px',
  //     panelClass:'cs-modal',
  //     data:{
  //       'from':'secondary_target',
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.get_user_data();
  
  //   });
  // }

  RoundOffNumber(achieve){
    return Math.ceil(achieve);
  }

}
