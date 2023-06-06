import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-redeem-request-list',
  templateUrl: './redeem-request-list.component.html'
})
export class RedeemRequestListComponent implements OnInit {
  
  fabBtnValue:any ='add';
  active_tab:any ='Pending'
  filter:any = {};
  redeemRequestList_data:any= []
  today_date: Date;
  pageCount:any;
  total_page:any; 
  page_limit: any = 50;
  pagenumber:any =1;
  start: any = 0;
  sr_no: number;
  loader: boolean=false;
  redeem_count:any = {}
  data:any ={}
  assign_login_data: any = [];
  assign_login_data2: any = [];
  downurl:any ='';
  constructor(public service:DatabaseService, public alert : DialogComponent, public toast:ToastrManager,public dialog : MatDialog,public route: Router,public session:sessionStorage) { 
    this.downurl = service.downloadUrl;
    this.redeemRequestList();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.today_date = new Date();
    
  }
  
  ngOnInit() {
  }
  pervious(){
    this.start = this.start - this.page_limit;
    this.redeemRequestList();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.redeemRequestList();
  }
  
  refresh()  {
    
    this.redeemRequestList('refresh')
  }
  redeemRequestList(action:any=''){
    if(action == 'refresh'){
      this.filter = {}
      this.redeemRequestList_data = []
    }
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    this.filter.status = this.active_tab
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},'RedeemRequest/redeemGiftRequestList').subscribe((resp)=>
    {
      if (resp['statusCode'] == 200){
        
        this.redeemRequestList_data = resp['gift_master_list']
        this.redeem_count = resp['tabCount']
        this.pageCount=resp['count'];
        
        
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
        this.loader = false;
        
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }
  openDialog(id,type, redeem_type, gift_status ): void {
    if(gift_status == 'Received'){
      this.alert.confirm('You want to change status ?').then((result) => {
        if (result) {
          this.service.post_rqst({'status': gift_status, 'id':id},'RedeemRequest/redeemRequestGiftStatusChange').subscribe((result)=>
          {
            if (result['statusCode'] == 200){
              this.toast.successToastr(result['statusMsg']);
              this.redeemRequestList();
            }
            else{
              this.toast.errorToastr(result['statusMsg']);
            }
          })
        }
      });
    }
    else{
      const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
        width: '400px', data: {
          'id': id,
          'delivery_from': type,
          'redeem_type':redeem_type,
          'gift_status':gift_status,
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        this.redeemRequestList();
      });
    }
  }
  gotoRedeemDetail(id,){
    this.route.navigate(["/redeem-detail/"+id],{ queryParams: {id} });
  }
  
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  
  exportAsXLSX(status)
  {
    this.filter.status = status;
    this.service.post_rqst(
      {'filter':this.filter, 'active_tab': this.active_tab},"Excel/redeem_gift_request_list"
      ).subscribe((result=>{
        
        if(result['msg'] == true){
          window.open(this.downurl + result['filename'])
          this.redeemRequestList('');
        }else{
          
        }
        
      }));
      
    }
    
  }
  