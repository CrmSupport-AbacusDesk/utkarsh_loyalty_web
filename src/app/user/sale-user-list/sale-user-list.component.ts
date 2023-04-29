import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-sale-user-list',
  templateUrl: './sale-user-list.component.html',
  animations: [slideToTop()]
  
})
export class SaleUserListComponent implements OnInit {
  userType:any = 'Sales User';
  logined_user_data:any={};
  assign_login_data: any = {};
  nodatafound:boolean=true;
  excel_data: any = [];
  tmp: any = [];
  fabBtnValue:any ='add';
  userlist: any = [];
  sales_count:any;
  system_count:any;
  filter: any = {}
  loader:boolean = false;
  Status: boolean = true;
  datanotfound = false;
  dialog: any;
  userData: any;
  userId: any;
  userName: any;
  sr_no: number;
  logined_user_data2:any;
  start: any = 0;
  total_page: any;
  pagenumber: any;
  count: any;
  page_limit: any;
  downurl: any = ''
  today_date: Date;
  
  
  constructor(public alert: DialogComponent, public toast:ToastrManager, public service: DatabaseService, public rout: Router, public dialog2: MatDialog,public session: sessionStorage) {
    this.page_limit = this.service.pageLimit;
    
    
    this.today_date = new Date();
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value;
    this.logined_user_data2 = this.logined_user_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
  }
  
  ngOnInit() {
    this.filter = this.service.getData()
    
    this.getUserList(this.userType);
    
  }
 
  pervious(){
    this.start = this.start - this.page_limit;
    this.getUserList(this.userType);
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.getUserList(this.userType);
  }
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }
  
  date_format(): void
  {
    this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD'); 
    this.getUserList(this.userType);
  }
  date_format1(): void
  {
    this.filter.date_of_joining=moment(this.filter.date_of_joining).format('YYYY-MM-DD'); 
    this.getUserList(this.userType);
  }
  
  getUserList(user_type) {
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.count - this.page_limit;
    }
    
    if(this.start<0){
      this.start=0;
    }
    this.service.post_rqst({ "active_tab":user_type,"start": this.start, "pagelimit": this.page_limit, "filter": this.filter }, "Master/salesUserList").subscribe((result) => {
      if(result['statusCode'] == 200){
        this.userlist = result['all_sales_user'];
        this.sales_count = result['type_count']['Sales User'];
        this.system_count = result['type_count']['System User'];
        if(this.userlist.length==0){
          this.nodatafound=false;
        }else{
          this.nodatafound=true;
        }
        setTimeout(() => {
          this.loader = false;
        }, 700);
        this.count = result['count'];
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.count - this.page_limit;
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.count / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        for(let i=0;i<this.userlist.length;i++)
        {
          if(this.userlist[i].status == '1')
          {
            this.userlist[i].user_status = true
          }
          else if(this.userlist[i].status == '0')
          {
            this.userlist[i].user_status=false;
            
          }
        }
        
        if (this.userlist.length == 0) {
          this.datanotfound = true;
        }
        else{
          this.datanotfound = false;
        }
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.loader = false;
      }
      
    })
    this.service.count_list();
  }
  
  Filename:any = ''
  getUserExcel(user_type) {
    this.loader = true;
    this.service.post_rqst({ "active_tab":user_type, "filter": this.filter }, "Excel/user_list_for_export").subscribe((result) => {
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.getUserList(user_type);
      }
    });
  }
  
  
  upload_excel(type)
  {
    const dialogRef = this.dialog2.open(UploadFileModalComponent,{
      width: '500px',
      panelClass:'cs-modal',
      data:{
        'from':'salesUser',
        'modal_type':type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      
      if(result != false){
        this.getUserList(this.userType);
      }
      
    });
  }
  
  
  refresh() {
    this.start = 0;
    this.filter={};
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.getUserList(this.userType);
  }
  
  userDetail(id) {
    let value = { "id": id }
    this.service.post_rqst(value, "User/user_detail").subscribe((result) => {
      this.rout.navigate(['/sale-user-detail/' + id]);
    })
  }
  
  
  
  updateStatus(index,id,event)
  {
    if(event.checked == false)
    {
      this.alert.confirm("You Want To Change Status !").then((result)=>{
        if(result){
          if (event.checked == false) {
            this.userlist[index].status = "0";
          }
          else {
            this.userlist[index].status = "1";
          }
          let value = this.userlist[index].status;
          this.service.post_rqst({ 'id': id, 'status': value,'status_changed_by_id':this.logined_user_data.data.id, 'status_changed_by_name':this.logined_user_data.data.name}, "Master/userStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == 200){
              this.toast.successToastr(resp['statusMsg']);
              this.getUserList(this.userType);
            }
            else{
              this.toast.errorToastr(resp['statusMsg']);
            }
          })
        }
      })
    }
    else if(event.checked == true){
      this.alert.confirm("You Want To Change Status !").then((result)=>{
        if(result){
          if (event.checked == false) {
            this.userlist[index].status = "0";
          }
          else {
            this.userlist[index].status = "1";
          }
          let value = this.userlist[index].status;
          this.service.post_rqst({ 'id': id, 'status': value,'status_changed_by_id':this.logined_user_data.data.id, 'status_changed_by_name':this.logined_user_data.data.name}, "Master/userStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == 200){
              this.toast.successToastr(resp['statusMsg']);
              this.getUserList(this.userType);
            }
            else{
              this.toast.errorToastr(resp['statusMsg']);
            }
          })
        }
      })
    }  
  }
  
  resetDevice(index,id)
  {
    this.alert.confirm("You Want To  Reset Device !").then((result)=>{
      if(result){
        this.service.post_rqst({ 'id': id, 'type':'user'}, "Master/resetDeviceId")
        .subscribe(resp => {
          if(resp['statusCode'] == 200){
            this.toast.successToastr(resp['statusMsg']);
            this.getUserList(this.userType);
          }
          else{
            this.toast.errorToastr(resp['statusMsg']);
          }
        })
      }
    })
    
  }
  
}
